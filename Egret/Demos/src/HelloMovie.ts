namespace demosEgret {
    /**
     * How to use
     * 1. Load data.
     * 2. addMovieGroup(movieBin, texture);
     * 3. movie = buildMovie("movieName");
     * 4. movie.play("clipName");
     * 5. addChild(movie);
     */
    export class HelloMovie extends BaseTest {
        public constructor() {
            super();

            this._resourceConfigURL = "resource/hello_movie.res.json";
        }

        protected _onStart(): void {
            dragonBones.addMovieGroup(RES.getRes("movie"), RES.getRes("texture"));
            const movie = dragonBones.buildMovie("DragonBoy");

            // Add event listener.
            movie.addEventListener(dragonBones.MovieEvent.START, this._movieEventHandler, this);
            movie.addEventListener(dragonBones.MovieEvent.LOOP_COMPLETE, this._movieEventHandler, this);
            movie.addEventListener(dragonBones.MovieEvent.COMPLETE, this._movieEventHandler, this);
            movie.addEventListener(dragonBones.MovieEvent.FRAME_EVENT, this._movieEventHandler, this);

            movie.play("walk");
            
            this.addChild(movie);

            movie.x = this.stage.stageWidth * 0.5;
            movie.y = this.stage.stageHeight * 0.5 + 100;
        }

        private _movieEventHandler(event: dragonBones.MovieEvent): void {
            console.log("Movie.", event.type, event.clipName, event.name || "");
        }
    }
}