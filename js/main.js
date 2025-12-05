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
    showMessage(`Место создано! ID: ${result.place_id}`, 'success')
    clearForm()
  } catch (error) {
    showMessage(`Ошибка: ${error.message}`, 'error')
  }
}

// Кнопка "Получить место"
async function handleGetPlace() {
  const placeId = document.getElementById('place-id-input').value

  if (!placeId) {
    showMessage('Введите place_id', 'error')
    return
  }

  try {
    const place = await getPlace(placeId)
    fillForm(place)
    showMessage(`Место "${place.name}" загружено`, 'success')
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
    })

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
