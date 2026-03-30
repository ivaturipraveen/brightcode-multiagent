def test_register_success(client):
    response = client.post(
        '/auth/register',
        json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'},
    )

    assert response.status_code == 200
    data = response.json()
    assert 'access_token' in data
    assert data['token_type'] == 'bearer'


def test_login_success(client):
    client.post('/auth/register', json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'})
    response = client.post('/auth/login', json={'email': 'test@example.com', 'password': 'secret123'})

    assert response.status_code == 200
    assert 'access_token' in response.json()


def test_invalid_password(client):
    client.post('/auth/register', json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'})
    response = client.post('/auth/login', json={'email': 'test@example.com', 'password': 'wrongpass'})

    assert response.status_code == 401
    assert response.json()['detail'] == 'Invalid email or password'


def test_duplicate_register(client):
    payload = {'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'}
    client.post('/auth/register', json=payload)
    response = client.post('/auth/register', json=payload)

    assert response.status_code == 400
    assert response.json()['detail'] == 'Email already registered'
