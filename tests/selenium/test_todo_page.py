from pathlib import Path


def test_todo_route_registered_in_frontend_router():
    app_file = Path('frontend/src/App.tsx').read_text(encoding='utf-8')

    assert 'path="/todo"' in app_file
    assert 'element={<TodoPage />}' in app_file


def test_todo_page_contains_core_features():
    page_file = Path('frontend/src/pages/TodoPage.tsx').read_text(encoding='utf-8')

    assert 'Todo app that stays out of your way.' in page_file
    assert 'Quick capture, clean filtering, and local persistence' in page_file
    assert 'brightcone.todo.items' in page_file
    assert 'Clear completed' in page_file
    assert 'Built as a standalone route at ' in page_file
