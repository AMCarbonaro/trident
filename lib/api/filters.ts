import { SavedView, FilterState } from '@/lib/stores/filterStore';

export async function fetchSavedViews(): Promise<SavedView[]> {
  const response = await fetch('/api/filters');

  if (!response.ok) {
    throw new Error('Failed to fetch saved views');
  }

  return await response.json();
}

export async function createSavedView(name: string, filters: FilterState): Promise<SavedView> {
  const response = await fetch('/api/filters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, filters }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create saved view');
  }

  return await response.json();
}

export async function deleteSavedView(id: string): Promise<void> {
  const response = await fetch(`/api/filters/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete saved view');
  }
}

