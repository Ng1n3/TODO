const inputValue = document.querySelector('.create_task')
const inputButton = document.querySelector('.add');

inputButton.addEventListener('click', e => {
    e.preventDefault();
    const taskValue = inputValue.value;
    if(taskValue == null || taskValue == '') return;
})