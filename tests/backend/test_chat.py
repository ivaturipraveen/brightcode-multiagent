from unittest.mock import AsyncMock, patch


class MockDelta:
    def __init__(self, content):
        self.content = content


class MockChoice:
    def __init__(self, content):
        self.delta = MockDelta(content)


class MockChunk:
    def __init__(self, content):
        self.choices = [MockChoice(content)]


class MockStream:
    def __init__(self, chunks):
        self._chunks = iter(chunks)

    def __aiter__(self):
        return self

    async def __anext__(self):
        try:
            return next(self._chunks)
        except StopIteration as exc:
            raise StopAsyncIteration from exc


def register_and_login(client):
    response = client.post(
        '/auth/register',
        json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'},
    )
    return response.json()['access_token']


def test_chat_endpoint_streams_mocked_openai_response(client):
    token = register_and_login(client)
    mock_stream = MockStream([MockChunk('Hello'), MockChunk(' world')])

    with patch('routes.chat.AsyncOpenAI') as mock_openai:
        mock_client = AsyncMock()
        mock_client.chat.completions.create = AsyncMock(return_value=mock_stream)
        mock_openai.return_value = mock_client

        response = client.post(
            '/chat',
            json={'message': 'Hi'},
            headers={'Authorization': f'Bearer {token}'},
        )

    assert response.status_code == 200
    assert 'data: {"token": "Hello", "conversation_id": 1}' in response.text
    assert 'data: {"token": " world", "conversation_id": 1}' in response.text
    assert 'data: [DONE]' in response.text


def test_conversation_history_endpoints(client):
    token = register_and_login(client)
    mock_stream = MockStream([MockChunk('Stored'), MockChunk(' reply')])

    with patch('routes.chat.AsyncOpenAI') as mock_openai:
        mock_client = AsyncMock()
        mock_client.chat.completions.create = AsyncMock(return_value=mock_stream)
        mock_openai.return_value = mock_client

        chat_response = client.post(
            '/chat',
            json={'message': 'First message'},
            headers={'Authorization': f'Bearer {token}'},
        )

    assert chat_response.status_code == 200

    conversations_response = client.get('/conversations', headers={'Authorization': f'Bearer {token}'})
    assert conversations_response.status_code == 200
    conversations = conversations_response.json()
    assert len(conversations) == 1
    assert conversations[0]['title'] == 'First message'

    conversation_id = conversations[0]['id']
    messages_response = client.get(
        f'/conversations/{conversation_id}/messages',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert messages_response.status_code == 200
    messages = messages_response.json()
    assert [message['role'] for message in messages] == ['user', 'assistant']
    assert messages[0]['content'] == 'First message'
    assert messages[1]['content'] == 'Stored reply'
