from unittest.mock import patch


def register_user(client, email='reset@example.com'):
    client.post('/auth/register', json={'name': 'Reset User', 'email': email, 'password': 'oldpassword123'})


def test_forgot_password_known_email(client):
    register_user(client)
    with patch('routes.auth.resend.Emails.send', return_value={'id': 'test-id'}):
        response = client.post('/auth/forgot-password', json={'email': 'reset@example.com'})
    assert response.status_code == 200
    assert 'message' in response.json()


def test_forgot_password_unknown_email(client):
    # Should always return 200 — no enumeration
    response = client.post('/auth/forgot-password', json={'email': 'nobody@example.com'})
    assert response.status_code == 200
    assert 'message' in response.json()


def test_reset_password_valid_token(client):
    register_user(client)
    captured_token = {}

    def mock_send(params):
        html = params.get('html', '')
        import re
        match = re.search(r'token=([A-Za-z0-9._-]+)', html)
        if match:
            captured_token['value'] = match.group(1)
        return {'id': 'test-id'}

    with patch('routes.auth.resend.Emails.send', side_effect=mock_send):
        client.post('/auth/forgot-password', json={'email': 'reset@example.com'})

    assert 'value' in captured_token, "Token not found in reset email"

    response = client.post('/auth/reset-password', json={
        'token': captured_token['value'],
        'new_password': 'newpassword456',
    })
    assert response.status_code == 200
    assert 'successfully' in response.json()['message']

    # Verify new password works
    login = client.post('/auth/login', json={'email': 'reset@example.com', 'password': 'newpassword456'})
    assert login.status_code == 200
    assert 'access_token' in login.json()


def test_reset_password_invalid_token(client):
    response = client.post('/auth/reset-password', json={
        'token': 'invalid.token.here',
        'new_password': 'newpassword456',
    })
    assert response.status_code == 400
    assert 'Invalid' in response.json()['detail']


def test_reset_password_too_short(client):
    register_user(client, 'short@example.com')
    captured_token = {}

    def mock_send(params):
        import re
        match = re.search(r'token=([A-Za-z0-9._-]+)', params.get('html', ''))
        if match:
            captured_token['value'] = match.group(1)
        return {'id': 'test-id'}

    with patch('routes.auth.resend.Emails.send', side_effect=mock_send):
        client.post('/auth/forgot-password', json={'email': 'short@example.com'})

    response = client.post('/auth/reset-password', json={
        'token': captured_token.get('value', 'bad'),
        'new_password': 'short',
    })
    assert response.status_code == 400
