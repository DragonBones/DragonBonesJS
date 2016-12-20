namespace demosEgret {
    /**
     * How to use
     * 1. Load data.
     * 2. addMovieGroup();
     * 3. movie = buildMovie("movieName");
     * 4. movie.play("clipName");
     * 5. addChild(movie);
     */
    export class HelloMovie extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/HelloMovie.res.json";
        }

        /** 
         * Init.
         */
        protected _onStart(): void {
            dragonBones.addMovieGroup(RES.getRes("movie"), RES.getRes("texture"));
            const movie = dragonBones.buildMovie("DragonBoy");

            // Movie listener.
            movie.addEventListener(dragonBones.MovieEvent.START, this._movieHandler, this);
            movie.addEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this._movieHandler, this);
            movie.addEventListener(dragonBones.MovieEvent.COMPLETE, this._movieHandler, this);
            movie.addEventListener(dragonBones.MovieEvent.FRAME_EVENT, this._movieHandler, this);

            movie.play("walk");
            this.addChild(movie);

            movie.x = this.stage.stageWidth * 0.5;
            movie.y = this.stage.stageHeight * 0.5 + 100;
        }

        /** 
         * Movie listener.
         */
        private _movieHandler(event: dragonBones.MovieEvent): void {
            console.log("Movie.", event.type, event.clipName, event.name || "");
        }
    }
}