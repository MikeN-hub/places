import { createPlace, deletePlace, updatePlace, getPlace } from './api.js'

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Собрать данные из формы
function getFormData() {
  const typesSelect = document.getElementById('place-types')
  const selectedTypes = Array.from(typesSelect.selectedOptions).map((option) => option.value)
  return {
    name: document.getElementById('place-name').value,
    address: document.getElementById('place-address').value,
    latitude: document.getElementById('place-lat').value,
    longitude: document.getElementById('place-lng').value,
    phone: document.getElementById('place-phone').value,
    types: selectedTypes.length > 0 ? selectedTypes : ['place', 'point_of_interest'],
  }
}

// Заполнить форму данными
function fillForm(placeData) {
  if (placeData.name) document.getElementById('place-name').value = placeData.name
  if (placeData.address) document.getElementById('place-address').value = placeData.address
  if (placeData.latitude || placeData.location?.lat) {
    document.getElementById('place-lat').value = placeData.latitude || placeData.location.lat
  }
  if (placeData.longitude || placeData.location?.lng) {
    document.getElementById('place-lng').value = placeData.longitude || placeData.location.lng
  }
  if (placeData.phone || placeData.phone_number) {
    document.getElementById('place-phone').value = placeData.phone || placeData.phone_number
  }
  if (placeData.accuracy !== undefined) {
    document.getElementById('place-accuracy').value = placeData.accuracy
  }
  if (placeData.website) {
    document.getElementById('place-website').value = placeData.website
  }

  // Заполняем типы
  if (placeData.types && document.getElementById('place-types')) {
    const typesSelect = document.getElementById('place-types')
    Array.from(typesSelect.options).forEach((option) => {
      option.selected = placeData.types.includes(option.value)
    })
  }
}

// Очистить форму
function clearForm() {
  document.getElementById('place-name').value = ''
  document.getElementById('place-address').value = ''
  document.getElementById('place-lat').value = ''
  document.getElementById('place-lng').value = ''
  document.getElementById('place-phone').value = ''
  document.getElementById('place-accuracy').value = ''
  document.getElementById('place-website').value = ''
  document.getElementById('place-id-input').value = ''

  // Сбрасываем типы к значениям по умолчанию
  const typesSelect = document.getElementById('place-types')
  if (typesSelect) {
    Array.from(typesSelect.options).forEach((option) => {
      option.selected = option.value === 'shoe park' || option.value === 'shop'
    })
  }
}

// Показать сообщение
function showMessage(text, type = 'info') {
  console.log(`${type}: ${text}`)
  alert(`${type.toUpperCase()}: ${text}`)
}

// ===== ОБРАБОТЧИКИ КНОПОК =====

// Кнопка "Создать место"
async function handleCreatePlace() {
  try {
    const formData = getFormData()
    const result = await createPlace(formData)

    // Сохраняем в таблицу
    const placeToSave = {
      place_id: result.place_id,
      name: formData.name,
      address: formData.address,
      phone_number: formData.phone,
      location: {
        lat: parseFloat(formData.latitude) || 0,
        lng: parseFloat(formData.longitude) || 0,
      },
      types: formData.types,
      accuracy: formData.accuracy,
      website: formData.website,
    }

    savePlaceToStorage(placeToSave)
    renderPlacesTable()

    showMessage(`Место создано! ID: ${result.place_id}`, 'success')
    clearForm()

    // Автоматически вставляем созданный ID в поле для операций
    document.getElementById('place-id-input').value = result.place_id
  } catch (error) {
    showMessage(`Ошибка: ${error.message}`, 'error')
  }
}

// Кнопка "Обновить место"
async function handleUpdatePlace() {
  const placeId = document.getElementById('place-id-input').value

  if (!placeId) {
    showMessage('Введите place_id для обновления', 'error')
    return
  }

  try {
    const formData = getFormData()
    const result = await updatePlace(placeId, {
      address: formData.address,
      name: formData.name,
    })

    // Обновляем в таблице
    const placeToUpdate = {
      place_id: placeId,
      name: formData.name,
      address: formData.address,
      phone_number: formData.phone,
      location: {
        lat: parseFloat(formData.latitude) || 0,
        lng: parseFloat(formData.longitude) || 0,
      },
      types: formData.types,
      accuracy: formData.accuracy,
      website: formData.website,
    }

    updatePlaceInTable(placeToUpdate)
    renderPlacesTable()

    showMessage(result.msg || 'Место обновлено', 'success')
  } catch (error) {
    showMessage(`Ошибка: ${error.message}`, 'error')
  }
}

// Кнопка "Удалить место"
async function handleDeletePlace() {
  const placeId = document.getElementById('place-id-input').value

  if (!placeId) {
    showMessage('Введите place_id для удаления', 'error')
    return
  }

  if (!confirm(`Удалить место с ID: ${placeId}?`)) {
    return
  }

  try {
    const result = await deletePlace(placeId)
    showMessage(result.msg || 'Место удалено', 'success')
    clearForm()
  } catch (error) {
    showMessage(`Ошибка: ${error.message}`, 'error')
  }
}

// ===== ПОДКЛЮЧЕНИЕ КНОПОК =====

function connectButtons() {
  console.log('Подключаем кнопки...')

  // Кнопка создания места
  const createBtn = document.getElementById('create-place')
  if (createBtn) {
    createBtn.addEventListener('click', handleCreatePlace)
    console.log('Кнопка "Создать место" подключена')
  }

  // Кнопка получения места
  const getBtn = document.getElementById('get-place')
  if (getBtn) {
    getBtn.addEventListener('click', handleGetPlace)
    console.log('Кнопка "Получить место" подключена')
  }

  // Кнопка обновления места
  const updateBtn = document.getElementById('update-place')
  if (updateBtn) {
    updateBtn.addEventListener('click', handleUpdatePlace)
    console.log('Кнопка "Обновить место" подключена')
  }

  // Кнопка удаления места
  const deleteBtn = document.getElementById('delete-place')
  if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDeletePlace)
    console.log('Кнопка "Удалить место" подключена')
  }

  // Кнопка очистки формы
  const clearBtn = document.getElementById('clear-form')
  if (clearBtn) {
    clearBtn.addEventListener('click', clearForm)
    console.log('Кнопка "Очистить форму" подключена')
  }

  // Кнопка обновления таблицы
  const refreshBtn = document.getElementById('refresh-places')
  if (refreshBtn) {
    refreshBtn.addEventListener('click', renderPlacesTable)
    console.log('✓ Кнопка "Обновить" подключена')
  }
}

// При загрузке страницы сразу рисуем таблицу
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM загружен, запускаем приложение...')

  connectButtons()
  renderPlacesTable()

  console.log('✅ Приложение готово!')
  console.log('📌 Используйте форму для создания мест')
  console.log('📌 Введите place_id для операций')
})

// Храним места в localStorage
const STORAGE_KEY = 'places_manager_places'

// Получить все места из localStorage
function getAllPlaces() {
  const places = localStorage.getItem(STORAGE_KEY)
  return places ? JSON.parse(places) : []
}

// Сохранить место в localStorage
function savePlaceToStorage(placeData) {
  const places = getAllPlaces()

  // Проверяем, существует ли уже место с таким ID
  const existingIndex = places.findIndex((p) => p.place_id === placeData.place_id)

  if (existingIndex >= 0) {
    // Обновляем существующее
    places[existingIndex] = { ...places[existingIndex], ...placeData }
  } else {
    // Добавляем новое
    places.push(placeData)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
  return placeData
}

// Удалить место из localStorage
function deletePlaceFromStorage(placeId) {
  const places = getAllPlaces()
  const filteredPlaces = places.filter((p) => p.place_id !== placeId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlaces))
}

// Обновить данные места в таблице
function updatePlaceInTable(placeData) {
  const places = getAllPlaces()
  const existingIndex = places.findIndex((p) => p.place_id === placeData.place_id)

  if (existingIndex >= 0) {
    places[existingIndex] = { ...places[existingIndex], ...placeData }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
  }
}

// Отрисовать таблицу мест
function renderPlacesTable() {
  const tableWrapper = document.querySelector('.table-wrapper')
  if (!tableWrapper) return

  const places = getAllPlaces()

  if (places.length === 0) {
    tableWrapper.innerHTML = `
      <div class="empty-table">
        <p>Мест пока нет</p>
        <p class="empty-table__hint">Создайте первое место, используя форму слева</p>
      </div>
    `
    return
  }

  // Создаем таблицу
  let tableHTML = `
    <table class="places-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Адрес</th>
          <th>Координаты</th>
          <th>Телефон</th>
          <th>Типы</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
  `

  places.forEach((place) => {
    const coords = place.location ? `${place.location.lat.toFixed(6)}, ${place.location.lng.toFixed(6)}` : 'Не указаны'

    const types = place.types ? (Array.isArray(place.types) ? place.types.join(', ') : place.types) : 'Не указаны'

    tableHTML += `
      <tr data-place-id="${place.place_id}">
        <td class="place-id-cell">
          <span class="place-id" title="Кликните для копирования">${place.place_id || 'N/A'}</span>
        </td>
        <td class="place-name-cell">${place.name || 'Не указано'}</td>
        <td class="place-address-cell">${place.address || 'Не указан'}</td>
        <td class="place-coords-cell">${coords}</td>
        <td class="place-phone-cell">${place.phone_number || place.phone || 'Не указан'}</td>
        <td class="place-types-cell">${types}</td>
        <td class="place-actions-cell">
          <button class="btn btn-small btn-load" data-action="load" data-id="${place.place_id}">Загрузить</button>
          <button class="btn btn-small btn-delete" data-action="delete" data-id="${place.place_id}">Удалить</button>
        </td>
      </tr>
    `
  })

  tableHTML += `
      </tbody>
    </table>
  `

  tableWrapper.innerHTML = tableHTML

  // Добавляем обработчики для кнопок в таблице
  attachTableEventListeners()
}

// Прикрепить обработчики событий для таблицы
function attachTableEventListeners() {
  // Кнопки "Загрузить" в таблице
  document.querySelectorAll('.btn-load').forEach((button) => {
    button.addEventListener('click', function () {
      const placeId = this.getAttribute('data-id')
      loadPlaceToForm(placeId)
    })
  })

  // Кнопки "Удалить" в таблице
  document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', function () {
      const placeId = this.getAttribute('data-id')
      deletePlaceFromTable(placeId)
    })
  })

  // Копирование ID по клику
  document.querySelectorAll('.place-id').forEach((element) => {
    element.addEventListener('click', function () {
      const placeId = this.textContent
      navigator.clipboard
        .writeText(placeId)
        .then(() => {
          showMessage(`ID ${placeId} скопирован в буфер обмена`, 'success')
        })
        .catch(() => {
          showMessage('Не удалось скопировать ID', 'error')
        })
    })
  })
}

// Загрузить место в форму
async function loadPlaceToForm(placeId) {
  if (!placeId) return

  try {
    // Сначала пытаемся получить из API
    const place = await getPlace(placeId)
    fillForm(place)
    document.getElementById('place-id-input').value = placeId
    showMessage(`Место "${place.name}" загружено`, 'success')
  } catch (error) {
    // Если нет в API, пробуем найти в localStorage
    const places = getAllPlaces()
    const localPlace = places.find((p) => p.place_id === placeId)

    if (localPlace) {
      fillForm(localPlace)
      document.getElementById('place-id-input').value = placeId
      showMessage(`Место "${localPlace.name}" загружено из локального хранилища`, 'info')
    } else {
      showMessage(`Место с ID ${placeId} не найдено`, 'error')
    }
  }
}

// Удалить место из таблицы (только локально)
function deletePlaceFromTable(placeId) {
  if (!confirm(`Удалить место с ID: ${placeId} из списка?`)) {
    return
  }

  deletePlaceFromStorage(placeId)
  renderPlacesTable()
  showMessage(`Место удалено из списка`, 'success')
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====

// Ждём загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM загружен, запускаем приложение...')

  connectButtons()

  console.log('Приложение готово!')
  console.log('Используйте форму для создания мест')
  console.log('Введите place_id для операций')
})
