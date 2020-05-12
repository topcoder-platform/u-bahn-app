sprites:
	cd public && convert ./sprites/*.png +append sprites.png

montage:
	cd ./public/sprites && montage $(shell cd ./public/sprites; ls) -background none -geometry +1+1 -tile 3x10 ../sprites.png