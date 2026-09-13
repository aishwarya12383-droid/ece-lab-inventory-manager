const API_BASE = '/api';

export async function getAllComponents() {
  const res = await fetch(`${API_BASE}/components`);
  if (!res.ok) throw new Error('Failed to fetch components');
  return res.json();
}

export async function getComponentById(id) {
  const res = await fetch(`${API_BASE}/components/${id}`);
  if (!res.ok) throw new Error('Failed to fetch component');
  return res.json();
}

export async function createComponent(component) {
  const res = await fetch(`${API_BASE}/components`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(component),
  });
  if (res.status === 409) throw new Error('Component ID already exists');
  if (!res.ok) throw new Error('Failed to create component');
  return res.json();
}

export async function updateComponent(id, component) {
  const res = await fetch(`${API_BASE}/components/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(component),
  });
  if (!res.ok) throw new Error('Failed to update component');
  return res.json();
}

export async function deleteComponent(id) {
  const res = await fetch(`${API_BASE}/components/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete component');
  return res.json();
}
