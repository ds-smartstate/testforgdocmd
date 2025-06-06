function exportGDocToMarkdownAndCommit() {
  // Параметры документа и Google Drive
  var DOCUMENT_ID = 'YOUR_DOCUMENT_ID'; // Замените на ID документа Google Docs
  var FOLDER_ID = ''; // Опционально: ID папки на Google Drive, оставить пустым для корневой папки
  
  // Параметры GitHub
  var GITHUB_USERNAME = 'YOUR_GITHUB_USERNAME'; // Замените на ваш логин GitHub
  var REPO_NAME = 'YOUR_REPO_NAME'; // Замените на имя репозитория
  var FILE_PATH = 'docs/output.md'; // Замените на путь к файлу в репозитории
  
  try {
    // Получаем GitHub токен из Script Properties
    var GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
    if (!GITHUB_TOKEN) {
      Logger.log('Ошибка: GITHUB_TOKEN не найден в Script Properties');
      return;
    }
    
    // Получаем файл через Google Drive API
    var file = DriveApp.getFileById(DOCUMENT_ID);
    
    // Экспортируем документ в формате Markdown через Google Drive API
    var url = 'https://www.googleapis.com/drive/v3/files/' + DOCUMENT_ID + '/export?mimeType=text/markdown';
    var response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      Logger.log('Ошибка при экспорте документа: ' + response.getContentText());
      return;
    }
    
    // Получаем содержимое в формате Markdown
    var markdownContent = response.getContentText();
    
    // Сохраняем файл на Google Drive
    var folder = FOLDER_ID ? DriveApp.getFolderById(FOLDER_ID) : DriveApp.getRootFolder();
    var outputFile = folder.createFile('output.md', markdownContent, MimeType.PLAIN_TEXT);
    Logger.log('Документ сохранен на Google Drive: ' + outputFile.getUrl());
    Logger.log('Ссылка для скачивания: ' + outputFile.getDownloadUrl());
    
    // Подготовка данных для коммита в GitHub
    var base64Content = Utilities.base64Encode(markdownContent, Utilities.Charset.UTF_8);
    var commitMessage = 'Auto-commit Markdown from Google Docs ' + new Date().toISOString();
    
    // Проверяем, существует ли файл в репозитории
    var getFileUrl = 'https://api.github.com/repos/' + GITHUB_USERNAME + '/' + REPO_NAME + '/contents/' + FILE_PATH;
    var getFileResponse = UrlFetchApp.fetch(getFileUrl, {
      method: 'GET',
      headers: {
        Authorization: 'token ' + GITHUB_TOKEN,
        Accept: 'application/vnd.github.v3+json'
      },
      muteHttpExceptions: true
    });
    
    var payload = {
      message: commitMessage,
      content: base64Content
    };
    
    // Если файл существует, добавляем SHA
    if (getFileResponse.getResponseCode() === 200) {
      var fileData = JSON.parse(getFileResponse.getContentText());
      payload.sha = fileData.sha;
    }
    
    // Отправляем файл в GitHub
    var commitUrl = 'https://api.github.com/repos/' + GITHUB_USERNAME + '/' + REPO_NAME + '/contents/' + FILE_PATH;
    var commitResponse = UrlFetchApp.fetch(commitUrl, {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + GITHUB_TOKEN,
        Accept: 'application/vnd.github.v3+json'
      },
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
    
    if (commitResponse.getResponseCode() === 200 || commitResponse.getResponseCode() === 201) {
      Logger.log('Файл успешно закоммичен в GitHub: ' + FILE_PATH);
    } else {
      Logger.log('Ошибка при коммите в GitHub: ' + commitResponse.getContentText());
    }
    
  } catch (error) {
    Logger.log('Произошла ошибка: ' + error);
  }
}

// Функция для настройки пользовательского меню
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Export to Markdown and Commit', 'exportGDocToMarkdownAndCommit')
    .addToUi();
}
