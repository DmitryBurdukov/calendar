const currentDate = document.querySelector('.calendar__date'),
      monthWrapper = document.querySelector('.calendar__month'),
      week = document.querySelector('.calendar__week'),
      weekDay = week.querySelectorAll('.weak__item'),
      prevBtn = document.querySelector('.calendar__btn_prev'),
      nextBtn = document.querySelector('.calendar__btn_next');
let messages = {
    "2023-11-06": "Some message NOVEMBER",
    "2023-09-11": "Septem",
    "2024-04-05": "Birthday"
}

const now = new Date();

function createDayBox(parent, date, empty = false, year, month) {
    const dayBox = document.createElement('div');
    let insideBox;
    dayBox.classList.add('calendar__day');
    if (setActive(`${year}-${validateDigit(month)}-${validateDigit(date)}`, messages)) {
        dayBox.classList.add('calendar__day_inside');

        insideBox = document.createElement('div');
        insideBox.classList.add('calendar__day_passive');
        insideBox.textContent = messages[`${year}-${validateDigit(month)}-${validateDigit(date)}`]
        // messages[`${year}-${validateDigit(month)}-${validateDigit(date)}`], 

        dayBox.addEventListener('mouseover', (e) =>  mouseOver(insideBox, 'calendar__day_hovered', 'calendar__day_passive'));
        dayBox.addEventListener('mouseleave', (e) =>  mouseOver(insideBox, 'calendar__day_passive', 'calendar__day_hovered'));

    }
    if (now.getFullYear() === year && now.getMonth() + 1 === validateDigit(month) && validateDigit(now.getDate()) === validateDigit(date)) {
        dayBox.classList.add('calendar__day_today');
    }
    if (!empty) {
        dayBox.textContent = date;
    } 
    parent.append(dayBox);
    if (dayBox.classList.contains('calendar__day_inside')) {
        dayBox.append(insideBox);
        console.log(dayBox)
        console.log(insideBox)
    }
    

}

function createMonth(wrapper, daysInMonth, startDay, m) {
    monthWrapper.innerHTML = '';
    const year = new Date(selectDay).getFullYear();
    const month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    currentDate.innerHTML = `${month[m]} <span>${year}</span>`
    for (let i = 1; i < startDay; i++) {
        createDayBox(wrapper, i, true, year, m + 1)
    }
    for (let i = 1; i <= daysInMonth; i++) {
        createDayBox(wrapper, i, false, year, m + 1);
    }
}

function getFirstDayOfMonth(date) {

    if (date.match(/\d\d\d\d\D\d\d\D/)) {
        const firstDay = new Date(`${date.match(/\d\d\d\d\D\d\d\D/).join('')}01`).getDay();
        if (firstDay === 0) {
            return firstDay + 7;
        }
        return firstDay;
    }
}

function getDayCount(date) {
    const daysCnt = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31];

    const mnth = new Date(date).getMonth();
    console.log((new Date(date).getFullYear() % 4 === 0))
    if (mnth === 1 && (new Date(date).getFullYear() % 4 === 0)) {
        return 29
    }
    return daysCnt[mnth]
}

function changeMonth(direction, date) {
    let changedDate = new Date(date),
        currentYear = changedDate.getFullYear(),
        currentMonth = changedDate.getMonth() + 1,
        currentDay = changedDate.getDate();
    if (direction === 'prev') {
        if (currentMonth - 1 == 0) {
            currentYear--;
        }
        selectDay = `${validateDigit(currentYear)}-${validateDigit(currentMonth-1, true)}-${validateDigit(currentDay)}`;
    }
    if (direction === 'next') {
        if (currentMonth + 1 == 13) {
            currentYear++;
        }
        selectDay = `${validateDigit(currentYear)}-${validateDigit(currentMonth+1, true)}-${validateDigit(currentDay)}`;
    }
    console.log(selectDay)
}

function validateDigit(dig, month = false) {
    if (!month) {
        if (dig < 10) {
            return `0${dig}`
        }
    }
    if (month) {
        if (dig > 12) {
            return `01`
        }
        if (dig < 1) {
            return 12
        }
    }
    return dig
} 
let selectDay = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

createMonth(monthWrapper, getDayCount(selectDay), getFirstDayOfMonth(selectDay), new Date(selectDay).getMonth());

prevBtn.addEventListener('click', (e) => {
    changeMonth('prev', selectDay)
    createMonth(monthWrapper, getDayCount(selectDay), getFirstDayOfMonth(selectDay), new Date(selectDay).getMonth())
});

nextBtn.addEventListener('click', (e) => {
    changeMonth('next', selectDay);
    createMonth(monthWrapper, getDayCount(selectDay), getFirstDayOfMonth(selectDay), new Date(selectDay).getMonth())
});

function setActive(checkDate, currDate) {
    if(checkDate in currDate) {
        return true
    } 
    return false
}


function mouseOver(element, hoveredClass, removedClass) {
    element.classList.add(hoveredClass);
    element.classList.remove(removedClass)
    console.log('ADD_CLASS')
}

function mouseLeave(parent, deletedClass) {
    parent.classList.remove(deletedClass);
    console.log(parent)
}

// console.log(new Date())