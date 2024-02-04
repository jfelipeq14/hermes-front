const btnBooking = document.getElementById('btnBooking')

const bookings = []
let booking = {}

btnBooking.addEventListener('click', (e) => {
  e.preventDefault()// Evitar que el formulario se envie de forma automatica
  const formBooking = document.getElementById('formBooking')
  // campos del formulario
  const fullname = formBooking.fullname.value
  const lastname = formBooking.lastname.value
  const documentType = formBooking.documentType.value
  const documentNumber = formBooking.documentNumber.value
  const birthdate = formBooking.birthdate.value
  const sex = formBooking.sex.value
  const phoneNumber = formBooking.phoneNumber.value
  const email = formBooking.email.value
  const address = formBooking.address.value
  const city = formBooking.city.value

  if (fullname !== '' && lastname !== '' && documentType !== '' && documentNumber !== '' && birthdate !== '' && sex !== '' && phoneNumber !== '' && email !== '' && address !== '' && city !== '') {
    // add data in object
    booking = {
      fullname,
      lastname,
      documentType,
      documentNumber,
      birthdate,
      sex,
      phoneNumber,
      email,
      address,
      city
    }
    // Agregar la booking al array de bookingciones
    if (booking) bookings.push(booking)
  }
  console.log(bookings)
})
