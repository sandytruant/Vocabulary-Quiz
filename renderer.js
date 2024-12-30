let vocabulary = [];

// 加载选定的词库
function loadVocabulary(vocabNumber) {
    return fetch(`vocabulary${vocabNumber}.json`)
        .then(response => response.json())
        .then(data => {
            vocabulary = data;
            // 隐藏选择界面，显示测试界面
            document.querySelector('.vocabulary-selector').style.display = 'none';
            document.getElementById('quizContainer').style.display = 'block';
            updateQuestion();
        })
        .catch(error => console.error('Error loading vocabulary:', error));
}

// 添加返回选择界面的函数
function backToSelection() {
    document.querySelector('.vocabulary-selector').style.display = 'block';
    document.getElementById('quizContainer').style.display = 'none';
    // 清空之前的选择
    document.querySelectorAll('input[name="vocab"]').forEach(radio => radio.checked = false);
    // 清空反馈信息
    document.getElementById('feedback').textContent = '';
}

// 初始化页面
function initializePage() {
    const startButton = document.getElementById('startQuiz');
    const backButton = document.getElementById('backButton');
    
    startButton.addEventListener('click', () => {
        const selectedVocab = document.querySelector('input[name="vocab"]:checked');
        if (selectedVocab) {
            loadVocabulary(selectedVocab.value);
        } else {
            alert('请选择一个词库！');
        }
    });

    backButton.addEventListener('click', backToSelection);
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
    if (vocabulary.length === 0) return;

    const wordObj = getRandomWord();
    const options = getOptions(wordObj.meaning);

    const questionElement = document.getElementById('question');
    questionElement.innerHTML = `What is the meaning of "<span class="word">${wordObj.word}</span>"?`;
    
    const optionsList = document.getElementById('options');
    optionsList.innerHTML = '';
    options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => checkAnswer(option, wordObj.meaning));
        
        // 添加鼠标悬停效果的音效（可选）
        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#f0f0f0';
        });
        
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = '';
        });
        
        optionsList.appendChild(li);
    });

    document.getElementById('feedback').textContent = '';
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

// 修改页面加载初始化
window.onload = initializePage;
