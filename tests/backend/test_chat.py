from unittest.mock import MagicMock, patch


class MockTextStream:
    """Simulates anthropic client.messages.stream() context manager yielding text chunks."""

    def __init__(self, chunks):
        self._chunks = chunks

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass

    @property
    def text_stream(self):
        return iter(self._chunks)


def register_and_login(client):
    response = client.post(
        '/auth/register',
        json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'},
    )
    return response.json()['access_token']


def test_chat_endpoint_streams_mocked_anthropic_response(client):
    token = register_and_login(client)
    mock_stream = MockTextStream(['Hello', ' world'])

    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}), \
         patch('routes.chat.anthropic.Anthropic') as mock_anthropic:
        mock_client = MagicMock()
        mock_client.messages.stream.return_value = mock_stream
        mock_anthropic.return_value = mock_client

        response = client.post(
            '/chat',
            json={'message': 'Hi'},
            headers={'Authorization': f'Bearer {token}'},
        )

    assert response.status_code == 200
    assert 'data: {"token": "Hello"' in response.text
    assert 'data: {"token": " world"' in response.text
    assert 'data: [DONE]' in response.text


def test_conversation_history_endpoints(client):
    token = register_and_login(client)
    mock_stream = MockTextStream(['Stored', ' reply'])

    with patch.dict('os.environ', {'ANTHROPIC_API_KEY': 'test-key'}), \
         patch('routes.chat.anthropic.Anthropic') as mock_anthropic:
        mock_client = MagicMock()
        mock_client.messages.stream.return_value = mock_stream
        mock_anthropic.return_value = mock_client

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
    assert [m['role'] for m in messages] == ['user', 'assistant']
    assert messages[0]['content'] == 'First message'
    assert messages[1]['content'] == 'Stored reply'
