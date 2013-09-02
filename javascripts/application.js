(function () {

    var showSection = function (name) {
        var a = document.querySelector("[data-section-title] a[href='#" + name + "']");
        if (!a) return;

        var title = a.parentNode;
        var section = title.parentNode;
        var container = section.parentNode;

        var actives = container.querySelectorAll('section.active');
        for (var i = 0; i < actives.length; i++) {
            actives[i].classList.remove('active');
        }
        section.classList.add('active');

        return true;
    };

    var resizeTabSections = function () {
        var containers = document.querySelectorAll("[data-section='tabs']");
        for (var i = 0; i < containers.length; i++) {
            var container = containers[i];
            var left = 0;

            var sections = container.querySelectorAll('section');
            for (var j = 0; j < sections.length; j++) {
                var section = sections[j];
                var title = section.querySelector("[data-section-title]");

                title.style.left = left + 'px';
                title.style.width = title.clientWidth + 'px';
                title.style.height = '50px';
                section.style.paddingTop = '49px';

                left += title.clientWidth;
            }
            container.setAttribute('data-section-resized', true);
        }
    };

    window.onhashchange = function (e) {
        var name = location.hash.replace(/^#/, '');
        if (name && showSection(name)) {
            if (e) e.preventDefault();
        }
    };

    resizeTabSections();
    window.onhashchange();

}());
