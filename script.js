// Select elements
const todoInput = document.getElementById('todoInput');
const prioritySelect = document.getElementById('prioritySelect');
const clearAllTodo = document.getElementById('clear_all')
const addTodoBtn = document.getElementById('addTodoBtn');
const importantTodos = document.getElementById('importantTodos');
const notImportantTodos = document.getElementById('notImportantTodos');
const clearImportantBtn = document.getElementById('clearImportantBtn');
const clearNotImportantBtn = document.getElementById('clearNotImportantBtn');
let countdown;
let hourSpan;
let minuteSpan;
let secundSpan;
let todosArray = []

// ذخیره تودو داخل آرایه
function newTodo(todoName, isImportant) {
    let newTodoObject = {
        id: todosArray.length + 1,
        title: todoName,
        status: false,
        Priority: isImportant,
        remainingSeconds: null // اضافه‌شده: مقدار اولیه برای زمان باقی‌مانده
    };

    todosArray.push(newTodoObject);
    setLocalStorage(todosArray);
    todoListGenerator(todosArray);

    todoInput.value = '';
}
// Add todo
addTodoBtn.addEventListener('click', () => {

    let todoTitle = todoInput.value.trim()
    const isImportant = prioritySelect.value === 'important'

    if (!todoTitle) {
        alert('لطفا ورودی هارا تکمیل کنید')
        return;
    }

    newTodo(todoTitle, isImportant)
    todoInput.value = ''

});
// ساختن تمپلیت تودو ها
function todoListGenerator(allTodosArray) {

    importantTodos.innerHTML = ''
    notImportantTodos.innerHTML = ''

    allTodosArray.forEach(function (todo) {
        let listItem = document.createElement('li')
        listItem.classList.add('todo-item')

        let spanWrapper = document.createElement('div')
        spanWrapper.classList.add('span-wrapper')

        let textSpan = document.createElement('span')
        textSpan.classList.add('todo-text')
        textSpan.innerHTML = todo.title

        let spanTimer = document.createElement('span')
        spanTimer.className = 'timer set_timer'
        spanTimer.innerHTML = 'ساعت رو تنظیم کن'
        spanTimer.style.cursor = 'pointer'

        let countdownTodo = document.createElement('div')
        countdownTodo.style.padding = '5px'
        countdownTodo.classList.add('timer_wrapper')
        hourSpan = document.createElement('span')
        minuteSpan = document.createElement('span')
        secundSpan = document.createElement('span')
        countdownTodo.append(hourSpan, minuteSpan, secundSpan)

        let timerInput = document.createElement('input')
        timerInput.type = 'time'
        timerInput.classList.add('timer-input')

        spanTimer.addEventListener('click', () => {
            timerInput.style.display = 'inline';
        });

        timerInput.addEventListener('change', () => {
            timerInput.style.display = 'none';

            const systemTime = new Date();
            const currentHours = systemTime.getHours();
            const currentMinutes = systemTime.getMinutes();

            let userTime = timerInput.value;
            let userHours = parseInt(userTime.split(":")[0]);
            let userMinutes = parseInt(userTime.split(":")[1]);

            let remainingSeconds = (userHours * 3600 + userMinutes * 60) - (currentHours * 3600 + currentMinutes * 60);

            if (remainingSeconds <= 0) {
                alert("زمان ورودی قبلاً گذشته است!");
            } else {
                const todoIndex = todosArray.findIndex(todo => todo.title === textSpan.innerHTML);
                if (todoIndex !== -1) {
                    todosArray[todoIndex].remainingSeconds = remainingSeconds; // ذخیره زمان باقی‌مانده
                    setLocalStorage(todosArray); // به‌روزرسانی در لوکال استوریج

                    startCountdown(todoIndex); // شروع تایمر
                }
            }
        });


        let btnsWrapper = document.createElement('div')
        btnsWrapper.classList.add('btns_Wrapper')


        let completeBtn = document.createElement('button')
        completeBtn.classList.add('status-btn')
        completeBtn.innerHTML = 'Done'
        completeBtn.addEventListener('click', function () {

            clearInterval(countdown)
            checkIsComplete(todo.id)
        })

        let deleteBtn = document.createElement('button')

        deleteBtn.classList.add('remove-btn')
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="30px" height="30px" fill-rule="nonzero"><g fill="#ff0000" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M14.98438,2.48633c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v0.5h-5.5c-0.26757,-0.00363 -0.52543,0.10012 -0.71593,0.28805c-0.1905,0.18793 -0.29774,0.44436 -0.29774,0.71195h-1.48633c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h18c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-1.48633c0,-0.26759 -0.10724,-0.52403 -0.29774,-0.71195c-0.1905,-0.18793 -0.44836,-0.29168 -0.71593,-0.28805h-5.5v-0.5c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212zM6,9l1.79297,15.23438c0.118,1.007 0.97037,1.76563 1.98438,1.76563h10.44531c1.014,0 1.86538,-0.75862 1.98438,-1.76562l1.79297,-15.23437z"></path></g></g></svg>'

        deleteBtn.addEventListener('click', function () {
            removeTodo(todo.id)
        })

        spanWrapper.append(textSpan, spanTimer, timerInput, countdownTodo)
        btnsWrapper.append(completeBtn, deleteBtn)
        listItem.append(spanWrapper, btnsWrapper)



        if (todo.status) {
            listItem.classList.toggle('todo-list-bgColor')
            completeBtn.innerHTML = listItem.classList.contains('todo-list-bgColor')
                ? 'Undone'
                : 'Done';
            textSpan.classList.toggle('active-toggle')
            spanTimer.classList.toggle('active-toggle')
            completeBtn.classList.toggle('active-toggle')
            deleteBtn.classList.toggle('active-toggle')

        }

        if (todo.Priority) {

            importantTodos.append(listItem)
        }

        else {
            notImportantTodos.append(listItem)
        }
    })
}
// ذخیره آرایه داخل لوکال استوریج
function setLocalStorage(allTodosArray) {
    localStorage.setItem('todos', JSON.stringify(allTodosArray))
}
// تابع شروع شمارش معکوس
function startCountdown(todoIndex) {
    let remainingSeconds = todosArray[todoIndex].remainingSeconds;

    countdown = setInterval(function () {
        if (remainingSeconds <= 0) {
            clearInterval(countdown);
            alert("زمان به پایان رسید!");
        } else {
            remainingSeconds--;
            todosArray[todoIndex].remainingSeconds = remainingSeconds; // به‌روزرسانی زمان باقی‌مانده
            setLocalStorage(todosArray);

            // تبدیل ثانیه‌ها به ساعت، دقیقه و ثانیه
            let hours = Math.floor(remainingSeconds / 3600);
            let minutes = Math.floor((remainingSeconds % 3600) / 60);
            let seconds = remainingSeconds % 60;

            hourSpan.innerHTML = (hours < 10 ? "0" : "") + hours + ":";
            minuteSpan.innerHTML = (minutes < 10 ? "0" : "") + minutes + ":";
            secundSpan.innerHTML = (seconds < 10 ? "0" : "") + seconds;
        }
    }, 1000);
}
// بازسازی تایمرها از لوکال استوریج هنگام بارگذاری
function getLocalStorage() {
    let getItem = JSON.parse(localStorage.getItem('todos'));

    if (getItem) {
        todosArray = getItem;

        todosArray.forEach((todo, index) => {
            if (todo.remainingSeconds > 0) {
                startCountdown(index); // بازسازی تایمر برای تسک‌هایی که زمان باقی دارند
            }
        });
    } else {
        todosArray = [];
    }
    todoListGenerator(todosArray);
}
// حذف کل تودو ها
function clearAll() {
    localStorage.removeItem('todos')
    todosArray = []
    todoListGenerator(todosArray)
}
// چک کردن وضعیت تودو
function checkIsComplete(todoID) {

    let getItem = JSON.parse(localStorage.getItem('todos'))
    todosArray = getItem

    todosArray.forEach(function (todo) {
        if (todo.id === todoID) {
            todo.status = !todo.status
        }
        todoListGenerator(todosArray)
        setLocalStorage(todosArray)
    })
}
// حذف همتن تودو
function removeTodo(todoID) {

    let getItem = JSON.parse(localStorage.getItem('todos'))
    todosArray = getItem

    let todoIndex = todosArray.findIndex(function (todo) {
        return todo.id == todoID
    })

    todosArray.splice(todoIndex, 1)
    setLocalStorage(todosArray)
    todoListGenerator(todosArray)
}

clearImportantBtn.addEventListener('click', function () {
    importantTodos.innerHTML = ''
    todoInput.value = ''
})
clearNotImportantBtn.addEventListener('click', function () {
    notImportantTodos.innerHTML = ''
    todoInput.value = ''
})
todoInput.addEventListener('keypress', function (event) {
    const isImportant = prioritySelect.value === 'important'
    if (event.key == 'Enter') {
        newTodo(todoInput.value, isImportant)
    }
})
clearAllTodo.addEventListener('click', clearAll)
window.addEventListener('load', getLocalStorage)