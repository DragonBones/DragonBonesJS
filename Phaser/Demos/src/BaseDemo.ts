
class BaseDemo extends Phaser.Scene {

    private static BACKGROUND_URL: string = "resource/background.png";
    
    preload(): void {
        this.load.image(BaseDemo.BACKGROUND_URL, BaseDemo.BACKGROUND_URL);
    }

    create(): void {
        this.add.image(0, 0, BaseDemo.BACKGROUND_URL);
    }

    public createText(str: string): Phaser.GameObjects.Text {
        const style = { fontSize: 18, color: "#FFFFFF", align: "center" };
        const text = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 100, str, style);
        text.setOrigin(.5, .5);
        return text;
    }
}
