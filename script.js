import {
	format,
	getUnixTime,
	fromUnixTime,
	addMonths,
	subMonths,
	startOfWeek,
	startOfMonth,
	endOfMonth,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
} from "date-fns"

const datePickerBtn = document.querySelector(".date-picker-button")
const datePickerBtnYear = document.querySelector(".year")
const datePicker = document.querySelector(".date-picker")
const datePickerHeaderCurrentMonth = document.querySelector(".current-month")
const previousMonthButton = document.querySelector(".prev-month-button")
const nextMonthButton = document.querySelector(".next-month-button")
const dateGrid = document.querySelector(".date-picker-grid-dates")
let currentDate = new Date()

datePickerBtn.addEventListener("click", () => {
	datePicker.classList.toggle("show")
	const selectedDate = fromUnixTime(datePickerBtn.dataset.selectedDate)
	currentDate = selectedDate
	setupDatePicker(selectedDate)
})

function setDate(date) {
	datePickerBtn.innerHTML = `${format(date, "yyyy")}
    <br>
    ${format(date, "EEE, MMMM do")}`
	datePickerBtn.dataset.selectedDate = getUnixTime(date)
}

function setupDatePicker(selectedDate) {
	datePickerHeaderCurrentMonth.innerText = format(currentDate, "MMMM yyyy")
	setupDates(selectedDate)
}

function setupDates(selectedDate) {
	const firstWeekStart = startOfWeek(startOfMonth(currentDate))
	const lastWeekEnd = endOfWeek(endOfMonth(currentDate))
	const dates = eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd })
	dateGrid.innerHTML = ""
	dates.forEach((date) => {
		const dateElement = document.createElement("button")
		dateElement.classList.add("date")
		dateElement.innerText = date.getDate()
		if (!isSameMonth(date, currentDate)) {
			dateElement.classList.add("date-picker-other-month-date")
		}
		if (isSameDay(date, selectedDate)) {
			dateElement.classList.add("selected")
		}

		dateElement.addEventListener("click", () => {
			setDate(date)
		})
		dateGrid.appendChild(dateElement)
	})
}

document.addEventListener("click", (e) => {
	if (e.target.matches(".date")) {
		const dateGrid = e.target.closest(".date-picker-grid-dates")
		const allDatesInGrid = Array.from(dateGrid.querySelectorAll(".date"))
		allDatesInGrid.forEach((date) => {
			date.classList.remove("selected")
		})
		e.target.classList.add("selected")
	}
	if (e.target.matches(".ok-btn")) {
		datePicker.classList.toggle("show")
	}
	if (e.target.matches(".today-btn")) {
		currentDate = new Date()
		setDate(currentDate)
		setupDatePicker(currentDate)
	}
})

nextMonthButton.addEventListener("click", () => {
	currentDate = addMonths(currentDate, 1)
	const selectedDate = fromUnixTime(datePickerBtn.dataset.selectedDate)
	setupDatePicker(selectedDate)
})

previousMonthButton.addEventListener("click", () => {
	currentDate = subMonths(currentDate, 1)
	const selectedDate = fromUnixTime(datePickerBtn.dataset.selectedDate)
	setupDatePicker(selectedDate)
})

setDate(new Date())
