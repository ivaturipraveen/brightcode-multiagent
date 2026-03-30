def register_user(client):
    response = client.post(
        '/auth/register',
        json={'name': 'Test User', 'email': 'test@example.com', 'password': 'secret123'},
    )
    return response


def test_register_returns_profile_fields(client):
    response = register_user(client)

    assert response.status_code == 200
    data = response.json()
    assert data['name'] == 'Test User'
    assert data['email'] == 'test@example.com'
    assert data['avatar_url'] == ''
    assert data['bio'] == ''


def test_get_and_update_profile(client):
    register_response = register_user(client)
    token = register_response.json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}

    get_response = client.get('/profile', headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()['name'] == 'Test User'

    update_response = client.put(
        '/profile',
        headers=headers,
        json={
            'name': 'Updated User',
            'email': 'updated@example.com',
            'avatar_url': 'https://example.com/avatar.png',
            'bio': 'Building with agents',
        },
    )

    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated['name'] == 'Updated User'
    assert updated['email'] == 'updated@example.com'
    assert updated['avatar_url'] == 'https://example.com/avatar.png'
    assert updated['bio'] == 'Building with agents'

    confirm_response = client.get('/profile', headers=headers)
    assert confirm_response.status_code == 200
    assert confirm_response.json()['name'] == 'Updated User'
    assert confirm_response.json()['email'] == 'updated@example.com'
