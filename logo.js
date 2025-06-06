(function(){
  'use strict';

  function startPlugin(){
    window.logoplugin = true;

    Lampa.Listener.follow('full', function(e){
      if(e.type !== 'complite' || Lampa.Storage.get('logo_glav') === '1') return;

      const data = e.data.movie;
      const type = data.name ? 'tv' : 'movie';
      if(!data.id) return;

      const url = Lampa.TMDB.api(
        `${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=${Lampa.Storage.get('language')}`
      );

      $.get(url, function(res){
        if(!res.logos || !res.logos[0]) return;
        const logoPath = res.logos[0].file_path;
        if(!logoPath) return;

        // создаём img, чтобы повесить onload
        const img = new Image();

        // выбираем источник: SVG → оригинал, иначе тоже оригинал
        if(logoPath.endsWith('.svg')){
          img.src = Lampa.TMDB.image('/t/p/original'+logoPath);
        } else {
          img.src = Lampa.TMDB.image('/t/p/original'+logoPath);
        }

        img.onload = function(){
          const NW = this.naturalWidth;
          const NH = this.naturalHeight;
          const MAX_W = 600;
          const MAX_H = 300;

          if (NW < MAX_W) {
            this.style.width  = NW + 'px';
            this.style.height = NH + 'px';
          } else {
            this.style.maxWidth  = MAX_W + 'px';
            this.style.maxHeight = MAX_H + 'px';
            this.style.width     = 'auto';
            this.style.height    = 'auto';
          }

          this.style.objectFit = 'contain';
          this.style.marginTop = '20px';
          this.style.marginBottom = '20px';

          e.object.activity.render()
            .find('.full-start-new__title')
            .html('')         // очищаем текст
            .append(this);    // вставляем наше <img>
        };

      });
    });
  }

  if(!window.logoplugin) startPlugin();
})();
