# Start project
1) npx express-generator --no-view

2) npm install

3) nodemon start (eller npm start)

4) git clone: https://github.com/EmmaHammar/vill-du-ha-mitt-nyhetsbrev-frontend

Frontend repo: https://emmahammar.github.io/vill-du-ha-mitt-nyhetsbrev-frontend/
Backend repo: https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/

# Admin-login
Heroku-länk: https://vill-du-ha-mitt-nyhetsbrev-be.herokuapp.com/admin eller http://localhost:3000/admin
Admin-användarnamn1: emma
Admin-lösenord: test1

Admin-användarnamn2: olle
Admin-lösenord: test2

# Inlämningsuppgift: Vill du ha mitt nyhetsbrev?
Uppgiften går ut på att utveckla ett användargränssnitt där besökare på din webbsida kan registrera ett nytt konto och då välja att prenumenera eller inte på ett nyhetsbrev. 
Sedan skall användaren kunna logga in på sitt skapade konto och ändra sin prenumerationsstatus.

På den här inlämningsuppgiften så skall du bygga både headless och monolit.
Applikationen för användare skall byggas som en headless applikation med vanilla js.
Administrationsgränssnittet skall köras på express servern som en monolit applikation.

Du skall använda MongoDB som databas för att lagra användaruppgifter.

Dokumentera tydligt i readme.md filen hur projektet skall installeras och startas.

Du skall lämna in ett dokument med länk till två repon ett för frontend och ett för din backend.

Siktar du på VG så lämna även in en länk till applikationen i produktion (dvs live).

 
Kravlista:

G Krav
DONE 1. Frontend applikationen (för besökare/användare) är uppsatt enligt headless principer.
DONE 2. Administrationsgränssnittet skall vara uppsatt enligt monolit principer.
DONE 3. Nya användare som sparas i frontend gränssittet skall sparas i en MongoDB databas.
DONE 4. En registrerad användare skall kunna logga in på frontend applikationen 
DONE 5. och där kunna ändra sin  prenumerationsstatus.
DONE 6. Nya användare får randomiserade nycklar som identifierar dem.
DONE 7. En administratör skall kunna logga in på express servern och där kunna se alla registrerade användare samt kunna se en lista på alla de mailadresser som prenumererar på ett nyhetsbrev.

VG krav
DONE Lösenorden som sparas skall vara krypterade.
DONE Frontend applikationen är deployad på Github pages
DONE Backend servern är deployad på Heroku
DONE Databasen är lagrad på MongoDB Atlas
För att få VG på uppgiften så skall även en skriven reflektion som når upp till kravet av nivå 2 (reflekterande text) lämnas in tillsammans med länkar till repos och projektet/sidan i produktion (live länk).

# Övrigt
https://randomkeygen.com/ för att generera random keys to admins