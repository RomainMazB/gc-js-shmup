class ObjectPoolMember {
    free = true
    data
    release = _ => {}

    constructor(pData) {
        this.data = pData
    }
}