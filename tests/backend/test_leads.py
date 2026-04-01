def register_and_login(client):
    client.post('/auth/register', json={'name': 'Test User', 'email': 'leads@example.com', 'password': 'secret123'})
    response = client.post('/auth/login', json={'email': 'leads@example.com', 'password': 'secret123'})
    return response.json()['access_token']


def auth_headers(token):
    return {'Authorization': f'Bearer {token}'}


def test_create_and_list_leads(client):
    token = register_and_login(client)
    client.post('/leads', json={'name': 'Alice', 'email': 'alice@example.com', 'company': 'Acme', 'value': 5000}, headers=auth_headers(token))
    client.post('/leads', json={'name': 'Bob', 'email': 'bob@example.com', 'company': 'Beta', 'value': 3000}, headers=auth_headers(token))

    response = client.get('/leads', headers=auth_headers(token))
    assert response.status_code == 200
    leads = response.json()
    assert len(leads) == 2
    names = {l['name'] for l in leads}
    assert names == {'Alice', 'Bob'}


def test_leads_are_user_scoped(client):
    # User A
    client.post('/auth/register', json={'name': 'User A', 'email': 'usera@example.com', 'password': 'secret123'})
    token_a = client.post('/auth/login', json={'email': 'usera@example.com', 'password': 'secret123'}).json()['access_token']

    # User B
    client.post('/auth/register', json={'name': 'User B', 'email': 'userb@example.com', 'password': 'secret123'})
    token_b = client.post('/auth/login', json={'email': 'userb@example.com', 'password': 'secret123'}).json()['access_token']

    client.post('/leads', json={'name': 'Lead A', 'email': 'lead@a.com'}, headers=auth_headers(token_a))
    client.post('/leads', json={'name': 'Lead B', 'email': 'lead@b.com'}, headers=auth_headers(token_b))

    leads_a = client.get('/leads', headers=auth_headers(token_a)).json()
    leads_b = client.get('/leads', headers=auth_headers(token_b)).json()

    assert len(leads_a) == 1 and leads_a[0]['name'] == 'Lead A'
    assert len(leads_b) == 1 and leads_b[0]['name'] == 'Lead B'


def test_update_lead_status(client):
    token = register_and_login(client)
    create_res = client.post('/leads', json={'name': 'Charlie', 'email': 'charlie@example.com'}, headers=auth_headers(token))
    lead_id = create_res.json()['id']

    update_res = client.patch(f'/leads/{lead_id}', json={'status': 'Qualified'}, headers=auth_headers(token))
    assert update_res.status_code == 200
    assert update_res.json()['status'] == 'Qualified'


def test_delete_lead(client):
    token = register_and_login(client)
    create_res = client.post('/leads', json={'name': 'Dave', 'email': 'dave@example.com'}, headers=auth_headers(token))
    lead_id = create_res.json()['id']

    del_res = client.delete(f'/leads/{lead_id}', headers=auth_headers(token))
    assert del_res.status_code == 204

    leads = client.get('/leads', headers=auth_headers(token)).json()
    assert all(l['id'] != lead_id for l in leads)


def test_cannot_delete_another_users_lead(client):
    client.post('/auth/register', json={'name': 'Owner', 'email': 'owner@example.com', 'password': 'secret123'})
    token_owner = client.post('/auth/login', json={'email': 'owner@example.com', 'password': 'secret123'}).json()['access_token']

    client.post('/auth/register', json={'name': 'Attacker', 'email': 'attacker@example.com', 'password': 'secret123'})
    token_attacker = client.post('/auth/login', json={'email': 'attacker@example.com', 'password': 'secret123'}).json()['access_token']

    lead = client.post('/leads', json={'name': 'Victim Lead', 'email': 'victim@example.com'}, headers=auth_headers(token_owner)).json()

    res = client.delete(f'/leads/{lead["id"]}', headers=auth_headers(token_attacker))
    assert res.status_code == 404
