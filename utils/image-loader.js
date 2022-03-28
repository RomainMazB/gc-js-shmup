
export default class ImageLoader {
    #callback

    constructor() {
        this.pathsLst = [];
        this.imagesLst = [];
        this.callback = null;
        this.loadedImagesCount = 0;
    }

    add(pPathImage) {
        this.pathsLst.push(pPathImage);
    }

    getTotalImages() {
        return this.pathsLst.length;
    }

    getTotalImagesLoaded() {
        return this.loadedImagesCount;
    }

    getLoadedRatio() {
        return this.loadedImagesCount / this.getTotalImages();
    }

    getListImages() {
        return this.imagesLst;
    }

    start(pCallBack) {
        this.callback = pCallBack;
        this.pathsLst.forEach(path => {
            let img = new Image();
            img.onload = this.imageLoaded.bind(this);
            img.src = path;
            this.imagesLst[path] = img;
        });
    }

    imageLoaded(e) {
        this.loadedImagesCount++;
        if (this.loadedImagesCount === this.pathsLst.length) {
            this.callback();
        }
    }

    getImage(pPath) {
        return this.imagesLst[pPath];
    }
}
