// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ReplaceNotify extends cc.Component {
    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.String)
    _text: string = "";


    @property({
        url: cc.Texture2D
    })
    textureUrl: string = '';

    @property({
        type: cc.String,
        displayName: '测试文本',
        tooltip: '用于测试'
    })
    get text(): string {
        return this._text;
    }
    set text(value) {
        this.notify(this._text, value);
        this._text = value;

    }
    notify(oldValue: string, newValue: string) {
        console.log(`oldValue:${oldValue},newValue:${newValue}`);
        if (!!this.tipLabel) {
            this.tipLabel.string = `oldValue:${oldValue},newValue:${newValue}`;
        }
        if (!!this.textureUrl) {
            console.warn(`this.textureUrl`, this.textureUrl);
            let node = new cc.Node('Texture Url Text');
            node.addComponent(cc.Sprite);
            let sprite = node.getComponent(cc.Sprite);
            sprite.spriteFrame = new cc.SpriteFrame(this.textureUrl)
            // sprite.spriteFrame.setTexture(this.textureUrl);
            // this.node.addChild(node);




            // let texture = new cc.Texture2D();
            // texture.url = this.textureUrl;

            cc.textureCache.addImage(this.textureUrl, (texture,error) => {
                console.log('加载完毕！');
                if (error) {
                    console.error(`laod error:${error.message}`, error);
                    return;
                }

                let urlNode = new cc.Node('UrlNode');
                urlNode.addComponent(cc.Sprite);
                let urlSprite = urlNode.getComponent(cc.Sprite);
                urlSprite.spriteFrame = new cc.SpriteFrame(texture);
                this.node.addChild(urlNode);


            }, this);


            // let urlNode = new cc.Node('UrlNode');
            // urlNode.addComponent(cc.Sprite);
            // let urlSprite = urlNode.getComponent(cc.Sprite);
            // urlSprite.spriteFrame = new cc.SpriteFrame(sprite.spriteFrame.getTexture());
            // this.node.addChild(urlNode);


            // let id = setInterval(() => {                
            //     console.log(`texture`,texture);
            //     if (texture.loaded) {
            //         let urlNode = new cc.Node('UrlNode');
            //         urlNode.addComponent(cc.Sprite);
            //         let urlSprite = urlNode.getComponent(cc.Sprite);
            //         urlSprite.spriteFrame = new cc.SpriteFrame(texture);
            //         this.node.addChild(urlNode);
            //         clearInterval(id);
            //     }
            // }, 30);

            // texture.isLoaded();


        }
    }
}
