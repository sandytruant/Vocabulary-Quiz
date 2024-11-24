let vocabulary = [];

// 从外部 JSON 文件加载词库
function loadVocabulary() {
    return fetch('vocabulary3.json')
        .then(response => response.json())
        .then(data => {
            vocabulary = data;
            updateQuestion(); // 数据加载后，开始出题
        })
        .catch(error => console.error('Error loading vocabulary:', error));
}

// 随机获取一个词条
function getRandomWord() {
    return vocabulary[Math.floor(Math.random() * vocabulary.length)];
}

// 获取四个选项，其中一个是正确释义，其他三个随机
function getOptions(correctMeaning) {
    let options = [correctMeaning];
    while (options.length < 4) {
        const randomMeaning = getRandomWord().meaning;
        if (!options.includes(randomMeaning)) {
            options.push(randomMeaning);
        }
    }
    return shuffle(options);
}

// 随机打乱数组
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 更新问题和选项
function updateQuestion() {
    if (vocabulary.length === 0) return; // 确保词库非空

    const wordObj = getRandomWord();
    const options = getOptions(wordObj.meaning);

    document.getElementById('question').textContent = `What is the meaning of "${wordObj.word}"?`;
    
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = ''; // 清空之前的选项
    options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => checkAnswer(option, wordObj.meaning));
        optionsList.appendChild(li);
    });

    document.getElementById('feedback').textContent = ''; // 清空反馈
}

// 检查答案
function checkAnswer(selected, correct) {
    const feedback = document.getElementById('feedback');
    if (selected === correct) {
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
        setTimeout(updateQuestion, 1000);
    } else {
        feedback.textContent = `Incorrect! The correct answer is: ${correct}`;
        feedback.style.color = 'red';
    }
}

// 页面加载时初始化词库
window.onload = loadVocabulary;
