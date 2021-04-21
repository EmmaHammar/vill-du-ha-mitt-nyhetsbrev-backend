# 1 problem
Fick att när du tryckte på logga ut så ändrades status på din prenumeration. Ville ju bara ha true/false ska ändras för subscription status om du trycker på knappen "ändra prenumerationsstatus". Tänkte att det var smart att köra på samma route för liknande process där jag vill skicka användarid till själva länken, men sen ville jag inte att det skulle vara samma callback(?) så när jag delade upp dem på två olika routes där den ena ('/subscribe/:id') ändrar till true om false och vice versa, medan den andra ('/userpage/:id') bara hämtar users och letar efter id:et i länken i users.json, för att hämta subscritption-värdet så att rätt text om subscriptionStatus visas på userPage-sidan. 
Delade upp '/userpage/:id' och '/subscribe/:id' 

# 2 kunna se databasen