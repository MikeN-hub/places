const API_BASE = 'https://rahulshettyacademy.com/maps/api/place'
const API_KEY = 'qaclick123'

// 1. СОЗДАТЬ место
export async function createPlace(placeData) {
  const response = await fetch(`${API_BASE}/add/json?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: {
        lat: parseFloat(placeData.latitude) || 0,
        lng: parseFloat(placeData.longitude) || 0,
      },
      accuracy: parseInt(placeData.accuracy) || 50,
      name: placeData.name,
      phone_number: placeData.phone || '',
      address: placeData.address,
      types: placeData.types || ['shoe park', 'shop'],
      website: placeData.website || 'http://example.com',
      language: 'en-US',
    }),
  })

  if (!response.ok) throw new Error('Ошибка при создании')
  return await response.json()
}

// 2. ПОЛУЧИТЬ место
export async function getPlace(placeId) {
  if (!placeId) throw new Error('Не указан place_id')

  const response = await fetch(`${API_BASE}/get/json?place_id=${placeId}&key=${API_KEY}`)

  if (!response.ok) throw new Error('Место не найдено')
  return await response.json()
}

// 3. ОБНОВИТЬ место
export async function updatePlace(placeId, updateData) {
  if (!placeId) throw new Error('Не указан place_id')

  const response = await fetch(`${API_BASE}/update/json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      place_id: placeId,
      key: API_KEY,
      address: updateData.address,
      name: updateData.name,
    }),
  })

  if (!response.ok) throw new Error('Ошибка при обновлении')
  return await response.json()
}

// 4. УДАЛИТЬ место
export async function deletePlace(placeId) {
  if (!placeId) throw new Error('Не указан place_id')

  const response = await fetch(`${API_BASE}/delete/json`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      place_id: placeId,
      key: API_KEY,
    }),
  })

  if (!response.ok) throw new Error('Ошибка при удалении')
  return await response.json()
}
