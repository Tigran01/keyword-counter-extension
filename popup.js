document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['wordList', 'caseSensitive'], function(result) {
      const wordList = result.wordList || [];
      const caseSensitive = result.caseSensitive || false;
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: countWordsOnPage,
            args: [wordList, caseSensitive]
          },
          (results) => {
            const wordListElement = document.getElementById('wordList');
            wordListElement.innerHTML = '';
  
            if (chrome.runtime.lastError || !results || !results[0]) {
              const errorMessage = 'Cannot run on this webpage';
              const li = document.createElement('li');
              li.textContent = errorMessage;
              wordListElement.appendChild(li);
              console.error('Script execution failed: ', chrome.runtime.lastError ? chrome.runtime.lastError.message : 'No results returned');
              return;
            }
  
            const counts = results[0].result;
            wordList.forEach((word, index) => {
              const li = document.createElement('li');
              li.textContent = `${word}: ${counts[index]}`;
              wordListElement.appendChild(li);
            });
          }
        );
      });
    });
  });
  
  function countWordsOnPage(wordList, caseSensitive) {
    const bodyText = document.body.innerText;
    return wordList.map(word => {
      const regex = new RegExp(`\\b${word}\\b`, caseSensitive ? 'g' : 'gi');
      return (bodyText.match(regex) || []).length;
    });
  }
  