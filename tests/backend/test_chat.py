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


def test_chat_endpoint_streams_mocked_openai_response(client):
    register_response = client.post(
        '/auth/register',
        json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'},
    )
    token = register_response.json()['access_token']

    mock_stream = MockStream([MockChunk('Hello'), MockChunk(' world')])

    with patch('backend.routes.chat.AsyncOpenAI') as mock_openai:
        mock_client = AsyncMock()
        mock_client.chat.completions.create = AsyncMock(return_value=mock_stream)
        mock_openai.return_value = mock_client

        response = client.post(
            '/chat',
            json={'message': 'Hi'},
            headers={'Authorization': f'Bearer {token}'},
        )

    assert response.status_code == 200
    assert 'data: {"token": "Hello"}' in response.text
    assert 'data: {"token": " world"}' in response.text
    assert 'data: [DONE]' in response.text
