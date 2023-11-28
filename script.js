const currentDate = document.querySelector('.calendar__date'),
      monthWrapper = document.querySelector('.calendar__month'),
      week = document.querySelector('.calendar__week'),
      weekDay = week.querySelectorAll('.weak__item'),
      prevBtn = document.querySelector('.calendar__btn_prev'),
      nextBtn = document.querySelector('.calendar__btn_next'),
      wrapper = document.querySelector('.wrapper'),
      calendar = document.querySelector('.calendar'),
      menu = document.querySelector('.menu'),
      menuInfo = menu.querySelector('.menu__info');

    //   inputBox = document.querySelector('.input');
const month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const now = new Date();

console.log(JSON.parse(localStorage.getItem('calendarReminders')));

let messages = {...JSON.parse(localStorage.getItem('calendarReminders'))},
    currentYear = now.getFullYear(),
    currentMonth = now.getMonth() + 1,
    selectDay = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
    currentShowDay,
    currentShowYear,
    currentShowMonth;
    
const remindDates = Object.keys(messages)

function createDayBox(parent, date, empty = false, year, month, isEmpty) { //Создаем один день и добавляем его в родителя
    const dayBox = document.createElement('div');
    let insideBox;
    dayBox.classList.add('calendar__day');
    if (isEmpty) {
        dayBox.classList.add('calendar__day_empty');
    }
    if (setActive(`${year}-${validateDigit(month)}-${validateDigit(date)}`, messages) && !isEmpty) {
        dayBox.classList.add('calendar__day_inside');

        insideBox = document.createElement('div');
        insideBox.classList.add('calendar__day_passive');
        insideBox.textContent = messages[`${year}-${validateDigit(month)}-${validateDigit(date)}`];
        
        dayBox.addEventListener('mouseover', (e) =>  mouseOver(insideBox, 'calendar__day_hovered', 'calendar__day_passive', date));
        dayBox.addEventListener('mouseleave', (e) =>  mouseOver(insideBox, 'calendar__day_passive', 'calendar__day_hovered', date));

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
    }
}

let interval;
function createMonth(wrapper, daysInMonth, startDay, m, clearIntervalFlag) {//Создаем месяц с проверками дня недели первого числа, наличия сохраненных напоминаний
    if (clearIntervalFlag) {
        clearInterval(interval)
    }
    monthWrapper.innerHTML = '';
    const year = new Date(selectDay).getFullYear();

    currentShowYear = `${validateDigit(year)}`
    currentShowMonth = `${validateDigit(m + 1)}`;
    currentDate.innerHTML = `${month[m]} <span>${year}</span>`;
    changeBackground(calendar, m)
    for (let i = 1; i < startDay; i++) {
        createDayBox(wrapper, i, true, year, m + 1, true);
    }
    let i = 1
    interval = setInterval(() => {
        createDayBox(wrapper, i++, false, year, m + 1, false);
        if (i > daysInMonth) {
            clearInterval(interval)
        }
    }, 5)
}

function getFirstDayOfMonth(date) {//находим день недели первого числа заданного месяца, необходимо для формирования пустых ячеек

    if (date.match(/\d\d\d\d\D\d\d\D/)) {
        const firstDay = new Date(`${date.match(/\d\d\d\d\D\d\d\D/).join('')}01`).getDay();
        if (firstDay === 0) {
            return firstDay + 7;
        }
        return firstDay;
    }
}

function getDayCount(date) {//возвращаем количество дней в текущем месяце, учитывая високосный год
    const daysCnt = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 31];

    const mnth = new Date(date).getMonth();
    if (mnth === 1 && (new Date(date).getFullYear() % 4 === 0)) {
        return 29
    }
    return daysCnt[mnth]
}

function changeMonth(direction, date) {//функционал по переключению на следующий/предыдущий месяц
    let changedDate = new Date(date),
        currentDay = changedDate.getDate(),
        currentShowYear = currentYear = changedDate.getFullYear(),
        currentMonth = changedDate.getMonth() + 1;

    if (direction === 'prev') {
        if (currentMonth - 1 == 0) {
            currentShowYear = currentYear--;
        }
        selectDay = `${validateDigit(currentYear)}-${validateDigit(currentMonth-1, true)}-${validateDigit(currentDay)}`;
    }
    if (direction === 'next') {
        if (currentMonth + 1 == 13) {
            currentShowYear = currentYear++;
        }
        selectDay = `${validateDigit(currentYear)}-${validateDigit(currentMonth+1, true)}-${validateDigit(currentDay)}`;
    }
}

function validateDigit(dig, isMonth = false) {//проверяем числа для обхода ошибок работы с обьектом даты и пр...

    if (isMonth) {
        if (dig > 12) {
            return `01`
        }
        if (dig < 1) {
            return 12
        }
    }
    if (dig < 10) {
        return `0${dig}`
    }
    return dig
} 

createMonth(monthWrapper, getDayCount(selectDay), getFirstDayOfMonth(selectDay), new Date(selectDay).getMonth());//инициализация первого месяца(текущий)

prevBtn.addEventListener('click', (e) => {//переключение на предыдущий месяц
    changeMonth('prev', selectDay)
    createMonth(monthWrapper, getDayCount(selectDay), getFirstDayOfMonth(selectDay), new Date(selectDay).getMonth(), true)
});

nextBtn.addEventListener('click', (e) => {//переключение на следующий месяц
    changeMonth('next', selectDay);
    createMonth(monthWrapper, getDayCount(selectDay), getFirstDayOfMonth(selectDay), new Date(selectDay).getMonth(), true)
});

function setActive(checkDate, currDate) {//помечаем не пустые дни, в которых уже есть напоминание
    if(checkDate in currDate) {
        return true
    } 
    return false
}

function mouseOver(element, hoveredClass, removedClass, day, toDelete) {//добавлено всплывающее окно с записанной информацией при наведении на элемент
    const escape = document.createElement('div');
    const del = document.createElement('div');
    if (!element.querySelector('.close')) {
        escape.classList.add('close');
        element.append(escape);
    }
    if (!element.querySelector('.del')) {
        del.classList.add('del');
        element.append(del);
    }
    element.classList.add(hoveredClass);
    element.classList.remove(removedClass);

    escape.addEventListener('click', () => {

        element.classList.add(removedClass);
        element.classList.remove(hoveredClass);

    })
    del.addEventListener('click', () => {
        if ( messages[`${validateDigit(currentShowYear)}-${(currentShowMonth)}-${validateDigit(parseInt(day))}`] ) {
            delete messages[`${validateDigit(currentShowYear)}-${(currentShowMonth)}-${validateDigit(parseInt(day))}`] ;
            element.closest('.calendar__day').classList.remove('calendar__day_inside');
            element.remove();
            saveRemindersToLocalStorage(messages);
        }
        // console.log(validateDigit(currentShowYear), validateDigit(currentShowMonth), validateDigit(parseInt(day)))
    })
}

function mouseLeave(parent, deletedClass) {//убирает всплывающее окно
    parent.classList.remove(deletedClass);
}

monthWrapper.addEventListener('click', (e) => {//открывает поле ввода напоминалки при нажатии на конкретный день
    let inputBox;

    if (e.target.classList.contains('calendar__day') && !e.target.classList.contains('calendar__day_empty')) {
        inputBox = document.createElement('div');
        inputBox.innerHTML = `<div class="input">
                                  <div class="close"></div>
                                  
                                  <textarea class="input__text" name="text" id="text" cols="30" rows="10"></textarea>
                                  <button class="input__btn">Сохранить изменения</button>
                              </div>`;
        wrapper.append(inputBox);
        inputBox.querySelector('.input__btn')
                .addEventListener('click', (eInput) => {addNewReminder(inputBox, messages, `${currentShowYear}-${currentShowMonth}-${validateDigit(e.target.textContent)}`, e);
                   });
        if (inputBox) {
            inputBox.addEventListener('click', (e) => {//закрывает поле ввода
                if (e.target.classList.contains('close')) { 
                    inputBox.remove();
                }
            });
            document.addEventListener('keydown', (e) => {
                if ( e.code === 'Escape' ) {
                    inputBox.remove();
                }
            })
        }
    }


})

function addNewReminder(box, saveTo, date, e) {
    const wrpr = box.querySelector('textarea');
    messages[date] = " " + wrpr.value;
    if (wrpr.value) {
        e.target.classList.add('calendar__day_inside');

        const insideBox = document.createElement('div');
        insideBox.classList.add('calendar__day_passive');
        insideBox.textContent = messages[`${date}`];
    
        e.target.append(insideBox);
        saveRemindersToLocalStorage(messages);
        e.target.addEventListener('mouseover', (e) =>  {
            mouseOver(insideBox, 'calendar__day_hovered', 'calendar__day_passive', e.target.textContent);
        });
        e.target.addEventListener('mouseleave', (e) =>  mouseOver(insideBox, 'calendar__day_passive', 'calendar__day_hovered', e.target.textContent));
        box.remove();
    }
}

function changeBackground(selector, currentMonth) {
    arrayBG = [
        'https://images.unsplash.com/photo-1575321628465-8442951bf066?auto=format&fit=crop&q=80&w=2127&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1514903936-98502c8f016f?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1540544405-352e62ff6098?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1681068894746-52e617aa991b?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1617259111814-31755625b3f1?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1517591200665-416e0c0d4a38?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1576347819574-903b60efcd69?auto=format&fit=crop&q=80&w=1933&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=1935&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1604400557709-fdcfba8ace1a?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1542174579867-81f19855ae18?auto=format&fit=crop&q=80&w=2064&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1542664483-9a6423c9bd73?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1533581892750-9748baec94ce?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ];
    selector.style.background = `url(${arrayBG[currentMonth]}) center center/cover no-repeat`;
}

function saveRemindersToLocalStorage(obj) {
    localStorage.setItem('calendarReminders', JSON.stringify(obj));
}

class CreateElement {
    constructor(tagName, className, name, parent) {
        this.name = name;
        this.name = document.createElement(tagName);
        this.name.classList.add(...className);
        parent.append(this.name);
    }
}
const modalWindow = new CreateElement('div', ['modal', 'hidden'], 'modalWindow', calendar);//, 'hidden'
const modalClose = new CreateElement('div', ['modal__close'], 'modalClose', modalWindow.name);
const over = new CreateElement('div', ['over', 'hidden'], 'over', calendar);
const modalWrapper = new CreateElement('ul', ['modal__wrapper'], 'modalWrapper', modalWindow.name);

modalWindow.name.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__close')) {
        modalWindow.name.classList.toggle('hidden');
        modalWindow.name.classList.toggle('visible');
        if (over.name.classList.contains('visible')) {
            over.name.classList.remove('visible');
            over.name.classList.add('hidden');
        }
    }
})

menu.addEventListener('click', (e) => {
    if (!e.target.classList.contains('info__item')) {
        menuInfo.classList.toggle('menu__info_active');
    }
    if (e.target.classList.contains('info__item') && e.target.classList.contains('info__item_all')) {
        const fullInfoStorage = JSON.parse(localStorage.getItem('calendarReminders'))
        let fullInfoArray = filterData(Object.keys(fullInfoStorage));
        modalWrapper.name.innerHTML = '';

        fullInfoArray.forEach(item => {
            const modalItem = new CreateElement('li', ['modal__item'], 'modalItem', modalWrapper.name);
            modalItem.name.textContent = `${item}:${fullInfoStorage[item]}`;
        });

        over.name.classList.remove('hidden');
        over.name.classList.add('visible');
        modalWindow.name.classList.remove('hidden');
        modalWindow.name.classList.add('visible');
    }
});

calendar.addEventListener('click', (e) => {
    const target = e.target;
    if ( target.classList !== 'info__item_all' && target !== menu && !target.classList.contains('menu__dot') && !target.classList.contains('info__item')) { 
        if (menuInfo.classList.contains('menu__info_active')) {
            closeElement(menuInfo, 'menu__info_active');
        }
    }

    //закрываем модалку, если клик вокруг нее
    if ((target.classList.contains('over') && modalWindow.name.classList.contains('visible'))) {
        modalWindow.name.classList.remove('visible');
        modalWindow.name.classList.add('hidden');
        over.name.classList.remove('visible');
        over.name.classList.add('hidden')
    }
})


function closeElement(element, className) {
    element.classList.remove(className);
}

function filterData(data) {//ФУНКЦИЯ ДЛЯ СОРТИРОВКИ ДАННЫХ. НЕОБХОДИМА ДЛЯ ВЫВОДА НАПОМИНАНИЙ ПОДРЯД ПО ДАТАМ.
    function compare(a, b) {
        let dateA = new Date(a);
        let dateB = new Date(b);
        return dateA - dateB;
    }
    let sortedArray = data.sort(compare);
    return sortedArray;
}

// filterData(messages);

// function useTheBell() {

// }

// function setCheckInterval() {
//     if ()
//     let interval = setInterval(() => {
        
//     }, );
// }

function checkTodayAndSound() {
    if (messages[`${new Date().getFullYear()}-${validateDigit(new Date().getMonth() + 1)}-${validateDigit(new Date().getDate())}`]) {
        // console.log(`${new Date().getFullYear()}-${validateDigit(new Date().getMonth() + 1)}-${validateDigit(new Date().getDate())}`);
        console.log('Есть напоминание')
    }
    else {
        console.log('Сегодня нет напоминаний');
    }
}

checkTodayAndSound()