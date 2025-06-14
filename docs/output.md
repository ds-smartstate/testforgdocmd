### **Подробная инструкция по настройке и использованию скрипта Google Apps Script для экспорта документа Google Docs в Markdown и автокоммита в GitHub**

Этот скрипт позволяет экспортировать документ Google Docs в формате Markdown (MIME-тип `text/markdown`) и автоматически коммитить его в указанный репозиторий GitHub с использованием GitHub API. Ниже приведены пошаговые инструкции по настройке и использованию.

---

### **Инструкции по настройке**

#### **1\. Подготовка Google Cloud и Google Docs**

1. **Создание проекта в Google Cloud Console**:  
   * Перейдите в [Google Cloud Console](https://console.cloud.google.com/).  
   * Создайте новый проект (например, `GDocToMarkdown`).  
   * Включите **Google Docs API** и **Google Drive API**:  
     * Перейдите в **APIs & Services** \-\> **Library**.  
     * Найдите и включите оба API.  
2. **Настройка OAuth**:  
   * В **APIs & Services** \-\> **Credentials** создайте учетные данные OAuth 2.0:  
     * Выберите тип приложения **Desktop app**.  
     * Скачайте JSON-файл с учетными данными (не требуется для Google Apps Script, но полезно для тестирования).  
   * Убедитесь, что ваш аккаунт Google имеет доступ к целевому документу Google Docs.  
3. **Получение ID документа**:  
   * Откройте документ Google Docs.  
   * Скопируйте ID из URL (например, в `https://docs.google.com/document/d/ВАШ_ID_ДОКУМЕНТА/edit` ID — это `ВАШ_ID_ДОКУМЕНТА`).

#### **2\. Подготовка GitHub**

1. **Создание Personal Access Token**:  
   * Перейдите в **Settings** \-\> **Developer settings** \-\> **Personal access tokens** \-\> **Tokens (classic)** на GitHub.  
   * Создайте токен с правами `repo` (для доступа к репозиториям).  
   * Сохраните токен в безопасном месте (например, в менеджере паролей).  
2. **Настройка репозитория**:  
   * Убедитесь, что у вас есть репозиторий на GitHub, куда будет коммититься файл.  
   * Запишите имя пользователя GitHub, имя репозитория и путь к файлу (например, `docs/output.md`).

#### **3\. Настройка Google Apps Script**

1. **Создание проекта**:  
   * Откройте Google Docs или Google Sheets.  
   * Перейдите в **Расширения** \-\> **Apps Script**.  
   * Удалите стандартный код и вставьте скрипт, приведенный ниже.  
   * Сохраните проект, задав имя (например, `ExportGDocToMarkdownAndCommit`).  
2. **Добавление сервисов**:  
   * В редакторе Apps Script нажмите на **\+** рядом с **Services**.  
   * Добавьте **Google Drive API** и **Google Docs API**.  
3. **Настройка scopes**:  
   * Включите отображение файла `appsscript.json` (в редакторе Apps Script: **Project Settings** \-\> **Show "appsscript.json" manifest file**).

Добавьте следующие scopes в `appsscript.json`:  
{  
  "timeZone": "America/New\_York",  
  "dependencies": {  
    "enabledAdvancedServices": \[  
      {  
        "userSymbol": "Drive",  
        "serviceId": "drive",  
        "version": "v2"  
      },  
      {  
        "userSymbol": "Docs",  
        "serviceId": "docs",  
        "version": "v1"  
      }  
    \]  
  },  
  "oauthScopes": \[  
    "https://www.googleapis.com/auth/documents",  
    "https://www.googleapis.com/auth/drive",  
    "https://www.googleapis.com/auth/script.external\_request"  
  \]  
}

*   
4. **Безопасное хранение GitHub токена**:  
   * Чтобы не хранить токен в коде, используйте **Script Properties**:  
     * В редакторе Apps Script перейдите в **Project Settings** \-\> **Script Properties**.  
     * Добавьте свойство с ключом `GITHUB_TOKEN` и значением вашего токена GitHub.  
   * В скрипте токен будет извлекаться из свойств.

#### **4\. Использование скрипта**

1. **Запуск**:  
   * Замените в скрипте `YOUR_DOCUMENT_ID`, `GITHUB_USERNAME`, `REPO_NAME` и `FILE_PATH` на ваши значения.  
   * Сохраните скрипт и нажмите **Run** в редакторе Apps Script или используйте пользовательское меню в Google Docs (**Custom Menu** \-\> **Export to Markdown and Commit**).  
   * При первом запуске подтвердите запрошенные разрешения (доступ к Google Docs, Drive и внешним API).  
2. **Что делает скрипт**:  
   * Экспортирует указанный документ Google Docs в формате Markdown.  
   * Сохраняет файл на Google Drive (в корневую папку или указанную папку).  
   * Коммитит файл в указанный репозиторий GitHub, обновляя существующий файл или создавая новый.  
   * Логирует результаты в **View** \-\> **Logs**.  
3. **Скачивание файла**:  
   * Скрипт сохраняет Markdown-файл на Google Drive (`output.md`).  
   * Для скачивания:  
     * Откройте Google Drive.  
     * Найдите файл `output.md` в корневой папке или указанной папке.  
     * Щелкните правой кнопкой мыши \-\> **Скачать**.  
4. **Автоматизация (опционально)**:  
   * Настройте триггер для автоматического запуска:  
     * В редакторе Apps Script перейдите в **Edit** \-\> **Current project's triggers**.  
     * Создайте триггер (например, ежедневный запуск функции `exportGDocToMarkdownAndCommit`).

#### **5\. Ограничения и рекомендации**

* **Квоты Google Apps Script**:  
  * Бесплатные аккаунты имеют ограничение на выполнение (6 минут) и количество внешних запросов. Для больших документов или частых коммитов рассмотрите Google Workspace.  
* **Форматирование Markdown**:  
  * Google Docs API может добавлять лишние пробелы или некорректно конвертировать сложные элементы (например, таблицы). При необходимости добавьте постобработку содержимого.  
* **Безопасность**:  
  * Не храните GitHub токен в коде. Используйте **Script Properties** или другой безопасный метод.  
* **GitHub API**:  
  * Убедитесь, что токен имеет права `repo`.  
  * Если файл уже существует в репозитории, скрипт обновит его, используя SHA для избежания конфликтов.

### **Как скачать файл**

* **После выполнения скрипта**:  
  * Файл `output.md` сохраняется на Google Drive в указанной папке (или в корневой, если `FOLDER_ID` не задан).  
  * Перейдите в Google Drive, найдите файл `output.md`, щелкните правой кнопкой мыши и выберите **Скачать**.

---

### **Дополнительные советы**

* **Обработка ошибок**:  
  * Проверяйте логи в **View** \-\> **Logs** для диагностики ошибок.  
  * Если GitHub API возвращает ошибку 403, проверьте права токена или квоты API.  
* **Триггеры**:  
  * Настройте триггер для периодического запуска (например, ежедневно) через **Edit** \-\> **Current project's triggers**.

