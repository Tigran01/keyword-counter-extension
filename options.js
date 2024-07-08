document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const addWordButton = document.getElementById('addWordButton');
    const wordListElement = document.getElementById('wordList');
    const caseSensitiveToggle = document.getElementById('caseSensitiveToggle');
  
    chrome.storage.sync.get(['wordList', 'caseSensitive'], function(result) {
      const wordList = result.wordList || [];
      const caseSensitive = result.caseSensitive || false;
      renderWordList(wordList);
      caseSensitiveToggle.checked = caseSensitive;
    });
  
    addWordButton.addEventListener('click', () => {
      const word = wordInput.value.trim();
      if (word) {
        chrome.storage.sync.get(['wordList'], function(result) {
          const wordList = result.wordList || [];
          wordList.push(word);
          chrome.storage.sync.set({ wordList }, function() {
            renderWordList(wordList);
            wordInput.value = '';
          });
        });
      }
    });
  
    caseSensitiveToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ caseSensitive: caseSensitiveToggle.checked });
    });
  
    function renderWordList(wordList) {
      wordListElement.innerHTML = '';
      wordList.forEach((word, index) => {
        const li = document.createElement('li');
        li.textContent = word;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
          wordList.splice(index, 1);
          chrome.storage.sync.set({ wordList }, function() {
            renderWordList(wordList);
          });
        });
        li.appendChild(removeButton);
        wordListElement.appendChild(li);
      });
    }
  });
  