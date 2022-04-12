document.addEventListener("DOMContentLoaded", init)

function init() {
    var buttonText = ["3 x 3", "4 x 4", "5 x 5", "6 x 6"]

    var images = ["krajobraz1.jpg", "krajobraz2.jpg", "krajobraz3.jpg", "krajobraz4.jpg"]

    var wygrana = []

    var selImage = 0
    var tabImage = [3, 0, 1, 2]
    var licznik = 1
    var licznikAnim = 0
    var licznikTab = 1
    var userClick = true
    var duringAnimation = false
    var timerIsStart = false
    var graSkonczona = true
    var timerToScreen = 0
    var timerToScreenInUTC = 0
    var animacjaObrazka = false

    var board = {
        size: 0,
        width: 0
    }



    // create image
    var switchImageContainer = document.createElement("div")
    switchImageContainer.id = "switchImages"

    // LEFT Arrow
    var image = document.createElement("img")
    image.src = "gfx/arrow.png"
    image.alt = "Left arrow"
    image.className = "switchImg"
    image.onclick = () => {
        if (duringAnimation == false && animacjaObrazka == false) {

            if (selImage > 0)
                selImage--
            else
                selImage = images.length - 1

            tabImage.unshift(tabImage.pop())

            changeImage(tabImage, false)

            // document.getElementById("mainImage").src = "gfx/" + images[selImage]
            // document.getElementById("board").innerHTML = ""
            // stopTimer();
            // renderTimer();
        }
    }
    switchImageContainer.appendChild(image)

    // Main Image

    renderImage(tabImage)



    // RIGHT Arrow
    var image = document.createElement("img")
    image.src = "gfx/arrow.png"
    image.alt = "Right arrow"
    image.style.transform = "rotate(180deg)"
    image.className = "switchImg"
    image.onclick = () => {
        if (duringAnimation == false && animacjaObrazka == false) {

            if (selImage < images.length - 1)
                selImage++
            else
                selImage = 0

            tabImage.push(tabImage.shift())

            changeImage(tabImage, true)

            // document.getElementById("mainImage").src = "gfx/" + images[selImage]
            // document.getElementById("board").innerHTML = ""
            // stopTimer();
            // renderTimer();
        }
    }
    switchImageContainer.appendChild(image)

    document.body.appendChild(switchImageContainer)
    document.getElementById("allImages").scrollLeft = 100

    // create OVERLAY AND OVERLAY TEXT
    var overlay = document.createElement('div')
    overlay.id = "overlay"


    document.body.appendChild(overlay)

    // RANKING

    var ranking = document.createElement("button")
    ranking.id = "ranking"
    ranking.innerHTML = "Ranking"
    ranking.addEventListener("click", function () {
        var overlay = document.getElementById("overlay")
        overlay.innerHTML = ""
        overlay.style.display = "block"
        var table = document.createElement("table")
        table.id = "tabRanking"

        for (let i = 0; i < buttonText.length; i++) {
            var tryb = document.createElement("button")
            tryb.innerHTML = buttonText[i]
            tryb.className = "btRanking"
            tryb.addEventListener("click", function () {
                table.innerHTML = ""
                var trybCookie = this.innerHTML[0]
                var wynikiCookie = JSON.parse(getCookie(trybCookie))

                var tr = document.createElement("tr")
                var th = document.createElement("th")
                th.innerText = "lp."
                tr.appendChild(th)

                var th = document.createElement("th")
                th.innerText = "nick"
                tr.appendChild(th)

                var th = document.createElement("th")
                th.innerText = "czas"
                tr.appendChild(th)

                table.appendChild(tr)

                for (let j = 0; j < wynikiCookie.length; j++) {
                    var tr = document.createElement("tr")
                    var td = document.createElement("td")
                    td.innerText = j + 1 + "."
                    tr.appendChild(td)

                    var td = document.createElement("td")
                    td.innerText = wynikiCookie[j].nick
                    tr.appendChild(td)

                    var td = document.createElement("td")
                    td.innerText = wynikiCookie[j].wynikCzas
                    tr.appendChild(td)
                    table.appendChild(tr)
                    overlay.appendChild(table)
                }

            })
            overlay.appendChild(tryb)
        }
        var btn = document.createElement("button")
        btn.className = "btRanking"
        btn.innerHTML = "Powrót"
        btn.addEventListener("click", function () {
            overlay.style.display = "none";
        })
        overlay.appendChild(btn)

    })
    document.body.appendChild(ranking)



    // create buttons - 3 x 3, 4 x 4, ...
    var buttonsContainer = document.createElement("div")
    buttonsContainer.id = "buttonsContainer"
    for (let i = 0; i < buttonText.length; i++) {
        var button = document.createElement("button")

        button.addEventListener("click", function () {
            if (duringAnimation == false) {
                duringAnimation = true
                document.getElementById("board").innerHTML = ""
                board.size = i + 3
                board.width = 600 / board.size
                wygrana = []
                graSkonczona = false
                stopTimer();
                renderTimer();

                for (let i = 0; i < board.size; i++) {
                    wygrana[i] = []
                    for (let j = 0; j < board.size; j++) {
                        wygrana[i][j] = licznikTab
                        licznikTab++
                    }
                }

                licznikTab = 1
                // console.table(wygrana)
                for (let i = 0; i < board.size; i++) {
                    for (let j = 0; j < board.size; j++) {
                        if ((i + 1) * (j + 1) < board.size * board.size) {
                            var partOfBoard = document.createElement("div")
                            partOfBoard.className = "partOfBoard"
                            partOfBoard.id = "partOfBoard" + licznik++
                            partOfBoard.style.width = board.width + "px"
                            partOfBoard.style.height = board.width + "px"
                            partOfBoard.style.left = j * board.width + "px"
                            partOfBoard.style.top = i * board.width + "px"
                            partOfBoard.style.background = 'url(gfx/' + images[selImage] + ')'
                            partOfBoard.style.backgroundPosition = -j * board.width + "px " + -i * board.width + "px"


                            partOfBoard.addEventListener("click", function () {

                                if (userClick == true && graSkonczona == false) {

                                    var direct = direction(this)
                                    var thisEl = this
                                    var empty = document.getElementById("partOfBoard0")


                                    if (direct == 2 || direct == 8 || direct == 6 || direct == 4) {
                                        var x = parseInt(thisEl.style.top) / board.width
                                        var y = parseInt(thisEl.style.left) / board.width

                                        var emptyX = parseInt(empty.style.top) / board.width
                                        var emptyY = parseInt(empty.style.left) / board.width

                                        var tmp = wygrana[emptyX][emptyY]
                                        wygrana[emptyX][emptyY] = wygrana[x][y]
                                        wygrana[x][y] = tmp
                                        // console.table(wygrana)
                                    }


                                    if (direct == 2)
                                        empty.style.top = parseInt(empty.style.top) - board.width + "px"
                                    else if (direct == 8)
                                        empty.style.top = parseInt(empty.style.top) + board.width + "px"
                                    else if (direct == 6)
                                        empty.style.left = parseInt(empty.style.left) - board.width + "px"
                                    else if (direct == 4)
                                        empty.style.left = parseInt(empty.style.left) + board.width + "px"


                                    var animation = setInterval(function () {
                                        if (direct == 2)
                                            thisEl.style.top = parseInt(thisEl.style.top) + 5 + "px"
                                        else if (direct == 8)
                                            thisEl.style.top = parseInt(thisEl.style.top) - 5 + "px"
                                        else if (direct == 6)
                                            thisEl.style.left = parseInt(thisEl.style.left) + 5 + "px"
                                        else if (direct == 4)
                                            thisEl.style.left = parseInt(thisEl.style.left) - 5 + "px"

                                        licznikAnim = licznikAnim + 5
                                        userClick = false
                                        if (licznikAnim >= board.width) {
                                            clearInterval(animation)
                                            licznikAnim = 0
                                            userClick = true
                                        }

                                    })

                                    if (check(this)) {
                                        stopTimer();
                                        userClick = false
                                        graSkonczona = true

                                        // WYGRANA //**//**//**//**//**//**//**---------
                                        var overlay = document.getElementById("overlay")
                                        overlay.innerHTML = ""

                                        var overlayText = document.createElement('div')
                                        overlayText.id = "text"
                                        overlay.appendChild(overlayText)
                                        var text = document.getElementById('text')
                                        text.innerHTML = "Wygrana! Twój czas:<br />" + timerToScreen + "<br />"

                                        var input = document.createElement("input")
                                        input.setAttribute("autocomplete", "off")
                                        input.id = "nick"
                                        input.setAttribute("placeholder", "nick")
                                        overlayText.appendChild(input)
                                        var button = document.createElement("button")
                                        button.innerHTML = "Zapisz"



                                        button.addEventListener("click", function (e) {
                                            e.preventDefault();
                                            overlay.style.display = "none"

                                            var obj = {
                                                nick: input.value,
                                                wynik: timerToScreenInUTC,
                                                wynikCzas: timerToScreen
                                            }

                                            var tab

                                            if (getCookie(board.size) == "") tab = []
                                            else tab = JSON.parse(getCookie(board.size))

                                            tab.push(obj)

                                            tab.sort(function (a, b) {
                                                return a.wynik - b.wynik
                                            })

                                            if (tab.length > 10) tab.splice(10, 1);

                                            console.table(tab)

                                            setCookie(board.size, JSON.stringify(tab), 5)



                                        })

                                        overlayText.appendChild(button)


                                        overlay.style.display = "block"

                                        overlay.appendChild(overlayText)

                                        overlay.style.display = "block"
                                        // overlay.addEventListener("click", function () {
                                        //     overlay.style.display = "none"
                                        // })
                                    }

                                }
                            })


                            document.getElementById("board").appendChild(partOfBoard)
                        }
                        else {
                            var partOfBoard = document.createElement("div")
                            partOfBoard.className = "partOfBoard"
                            partOfBoard.id = "partOfBoard0"
                            partOfBoard.style.width = board.width + "px"
                            partOfBoard.style.height = board.width + "px"
                            partOfBoard.style.left = (board.size - 1) * board.width + "px"
                            partOfBoard.style.top = (board.size - 1) * board.width + "px"

                            document.getElementById("board").appendChild(partOfBoard)

                        }
                    }
                }


                var animation = setInterval(function () {
                    var empty = document.getElementById("partOfBoard0")

                    var emptyX = parseInt(empty.style.top) / board.width
                    var emptyY = parseInt(empty.style.left) / board.width

                    if ((emptyY > 0 && emptyY < board.size - 1) && (emptyX > 0 && emptyX < board.size - 1)) {
                        var iloscMozliwosci = 4
                        var losuj = Math.floor(Math.random() * 4)
                    }
                    else if ((emptyY == 0 && emptyX == board.size - 1) || (emptyY == board.size - 1 && emptyX == board.size - 1) || (emptyY == board.size - 1 && emptyX == 0) || (emptyY == 0 && emptyX == 0)) {
                        var iloscMozliwosci = 2
                        var losuj = Math.floor(Math.random() * 2)
                    }
                    else {
                        var iloscMozliwosci = 3
                        var losuj = Math.floor(Math.random() * 3)
                    }



                    if (iloscMozliwosci == 2) {
                        if (emptyY == board.size - 1 && emptyX == board.size - 1) {
                            if (losuj == 0) { // góra
                                random = 1
                                var elX = emptyY
                                var elY = emptyX - 1
                            }
                            else { // lewo
                                random = 2
                                var elX = emptyY - 1
                                var elY = emptyX
                            }

                        }
                        else if (emptyY == board.size - 1 && emptyX == 0) {
                            if (losuj == 0) { // dół
                                random = 0
                                var elX = emptyY
                                var elY = emptyX + 1
                            }
                            else { // lewo
                                random = 2
                                var elX = emptyY - 1
                                var elY = emptyX
                            }

                        }
                        else if (emptyY == 0 && emptyX == 0) {
                            if (losuj == 0) { // dół
                                random = 0
                                var elX = emptyY
                                var elY = emptyX + 1
                            }
                            else { // prawo
                                random = 3
                                var elX = emptyY + 1
                                var elY = emptyX
                            }

                        }
                        else if (emptyY == 0 && emptyX == board.size - 1) {
                            if (losuj == 0) { // góra
                                random = 1
                                var elX = emptyY
                                var elY = emptyX - 1
                            }
                            else { // prawo
                                random = 3
                                var elX = emptyY + 1
                                var elY = emptyX
                            }

                        }

                    }


                    else if (iloscMozliwosci == 3) {
                        if (emptyY > 0 && emptyX == board.size - 1) {
                            if (losuj == 0) { // dół
                                random = 3
                                var elX = emptyY + 1
                                var elY = emptyX
                            }
                            else if (losuj == 1) { // góra
                                random = 1
                                var elX = emptyY
                                var elY = emptyX - 1
                            }
                            else { //prawo
                                random = 2
                                var elX = emptyY - 1
                                var elY = emptyX
                            }
                        }
                        else if (emptyX > 0 && emptyY == board.size - 1) {
                            if (losuj == 0) { // dół
                                random = 0
                                var elX = emptyY
                                var elY = emptyX + 1
                            }
                            else if (losuj == 1) { // góra
                                random = 1
                                var elX = emptyY
                                var elY = emptyX - 1
                            }
                            else { //lewo
                                random = 2
                                var elX = emptyY - 1
                                var elY = emptyX
                            }
                        }
                        else if (emptyX < board.size - 1 && emptyY == 0) {
                            if (losuj == 0) { // dół
                                random = 0
                                var elX = emptyY
                                var elY = emptyX + 1
                            }
                            else if (losuj == 1) { // góra
                                random = 1
                                var elX = emptyY
                                var elY = emptyX - 1
                            }
                            else { // prawo
                                random = 3
                                var elX = emptyY + 1
                                var elY = emptyX
                            }
                        }
                        else if (emptyY < board.size - 1 && emptyX == 0) {
                            if (losuj == 0) { // lewo
                                random = 2
                                var elX = emptyY - 1
                                var elY = emptyX
                            }
                            else if (losuj == 1) { // dół
                                random = 0
                                var elX = emptyY
                                var elY = emptyX + 1
                            }
                            else { // prawo
                                random = 3
                                var elX = emptyY + 1
                                var elY = emptyX
                            }
                        }
                    }

                    else if (iloscMozliwosci == 4) {
                        if (losuj == 0) { // góra
                            random = 1
                            var elX = emptyY
                            var elY = emptyX - 1
                        }
                        else if (losuj == 1) { // prawo
                            random = 3
                            var elX = emptyY + 1
                            var elY = emptyX
                        }
                        else if (losuj == 2) { // lewo
                            random = 2
                            var elX = emptyY - 1
                            var elY = emptyX
                        }
                        else { // dół
                            random = 0
                            var elX = emptyY
                            var elY = emptyX + 1
                        }
                    }

                    var thisElIndex = wygrana[elY][elX]

                    var thisEl = document.getElementById("partOfBoard" + thisElIndex)

                    var x = parseInt(thisEl.style.top) / board.width
                    var y = parseInt(thisEl.style.left) / board.width

                    var tmp = wygrana[emptyX][emptyY]
                    wygrana[emptyX][emptyY] = wygrana[x][y]
                    wygrana[x][y] = tmp

                    if (random == 1) {
                        empty.style.top = parseInt(empty.style.top) - board.width + "px"
                        thisEl.style.top = parseInt(thisEl.style.top) + board.width + "px"
                    }
                    else if (random == 0) {
                        empty.style.top = parseInt(empty.style.top) + board.width + "px"
                        thisEl.style.top = parseInt(thisEl.style.top) - board.width + "px"
                    }
                    else if (random == 2) {
                        empty.style.left = parseInt(empty.style.left) - board.width + "px"
                        thisEl.style.left = parseInt(thisEl.style.left) + board.width + "px"
                    }
                    else if (random == 3) {
                        empty.style.left = parseInt(empty.style.left) + board.width + "px"
                        thisEl.style.left = parseInt(thisEl.style.left) - board.width + "px"
                    }

                    licznikAnim++

                    if (licznikAnim >= board.size * board.size * 10) {
                        clearInterval(animation)
                        licznikAnim = 0
                        duringAnimation = false
                        startTimer()
                        // console.table(wygrana)
                    }

                }, 10)

                licznik = 1

            }
        })



        function direction(thisEl) {

            var empty = document.getElementById("partOfBoard0")

            if (parseInt(thisEl.style.top) + board.width == parseInt(empty.style.top) && thisEl.style.left == empty.style.left) {
                return 2;
            }
            else if (parseInt(thisEl.style.top) - board.width == parseInt(empty.style.top) && thisEl.style.left == empty.style.left) {
                return 8;
            }
            else if (parseInt(thisEl.style.left) + board.width == parseInt(empty.style.left) && thisEl.style.top == empty.style.top) {
                return 6;
            }
            else if (parseInt(thisEl.style.left) - board.width == parseInt(empty.style.left) && thisEl.style.top == empty.style.top) {
                return 4;
            }

        }

        function startTimer() {
            // console.log("START TIMERA")

            renderTimer();


            var timer = document.getElementById("timer")
            var date = new Date()
            var hours = date.getHours()
            var minutes = date.getMinutes()
            var seconds = date.getSeconds()
            var milliseconds = date.getMilliseconds()

            timerAnimation = setInterval(function () {

                var currentDate = new Date(new Date() - date)

                var currentHours = currentDate.getHours() - 1
                if (currentHours < 10) currentHours = "0" + currentHours
                var currentMinutes = currentDate.getMinutes()
                if (currentMinutes < 10) currentMinutes = "0" + currentMinutes
                var currentSeconds = currentDate.getSeconds()
                if (currentSeconds < 10) currentSeconds = "0" + currentSeconds
                var currentMilliseconds = currentDate.getMilliseconds()
                if (currentMilliseconds < 100 && currentMilliseconds > 10) currentMilliseconds = "0" + currentMilliseconds
                else if (currentMilliseconds < 10) currentMilliseconds = "00" + currentMilliseconds

                timerToScreen = currentHours + ":" + currentMinutes + ":" + currentSeconds + "." + currentMilliseconds

                timerToScreenInUTC = currentDate.getTime()

                changeTimer(currentHours + ":" + currentMinutes + ":" + currentSeconds + "." + currentMilliseconds)

                timerIsStart = true

            }, 47)

        }

        function renderTimer() {
            var timer = document.getElementById('timer')
            timer.innerHTML = ''

            var czas = "00:00:00.000"
            for (let i = 0; i < czas.length; i++) {
                var number = document.createElement("img")
                switch (czas[i]) {
                    case ':':
                        number.src = "gfx/numbers/colon.gif"
                        break;
                    case '.':
                        number.src = "gfx/numbers/dot.gif"
                        break;
                    default:
                        number.src = "gfx/numbers/c" + czas[i] + ".gif"
                        break;
                }
                timer.appendChild(number)
            }
        }

        function changeTimer(czas) {
            var timer = document.getElementById("timer").children

            if (!czas) var czas = "00:00:00.000"
            var j = 0;

            for (let i = 0; i < czas.length; i++) {
                switch (czas[i]) {
                    case ':':
                        timer[j].src = "gfx/numbers/colon.gif"
                        break;
                    case '.':
                        timer[j].src = "gfx/numbers/dot.gif"
                        break;
                    default:
                        timer[j].src = "gfx/numbers/c" + czas[i] + ".gif"
                        break;
                }
                j++
            }
        }

        function stopTimer() {
            if (timerIsStart == true) clearInterval(timerAnimation)
        }

        function check(thisEl) {

            var licznikCheckTab = 1
            checkTable = true

            for (let i = 0; i < board.size; i++) {
                for (let j = 0; j < board.size; j++) {
                    // console.log(wygrana[i][j] + "   " + licznikCheckTab)
                    if (wygrana[i][j] != licznikCheckTab) {
                        checkTable = false
                    }
                    licznikCheckTab++
                }
            }
            return checkTable
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        var buttonTextNode = document.createTextNode(buttonText[i])
        button.appendChild(buttonTextNode)
        buttonsContainer.appendChild(button)
    }
    document.body.appendChild(buttonsContainer)



    function renderImage(tab) {
        var imageContainer = document.createElement("div")
        imageContainer.id = "allImages"
        var boxAllImages = document.createElement("div")
        boxAllImages.id = "boxAllImages"

        for (let i = 0; i < 3; i++) {
            var image = document.createElement("img")
            image.src = "gfx/" + images[tab[i]]
            image.alt = "Image: " + selImage
            image.id = "mainImage" + i
            image.className = "switchImg"
            boxAllImages.appendChild(image)
        }

        imageContainer.appendChild(boxAllImages)
        switchImageContainer.appendChild(imageContainer)
    }

    function changeImage(tab, direction) { // true - right, false - left

        var box = document.getElementById("allImages")
        var animeImageCount = 0
        animacjaObrazka = true


        var animeImage = setInterval(function () {
            if (animeImageCount < 50) {
                if (direction == true) box.scrollLeft = box.scrollLeft + 2
                else box.scrollLeft = box.scrollLeft - 2
                animeImageCount++
            }
            else {
                clearInterval(animeImage)
                for (let i = 0; i < 3; i++) {
                    var image = document.getElementById("mainImage" + i)
                    image.src = "gfx/" + images[tab[i]]
                    image.alt = "Image: " + selImage
                }
                animacjaObrazka = false
                box.scrollLeft = 100
            }
        }, 10)
    }

    // create timer
    var timer = document.createElement("div")
    timer.id = "timer"
    document.body.appendChild(timer)


    // create board
    var board = document.createElement("div")
    board.id = "board"
    document.body.appendChild(board)


}