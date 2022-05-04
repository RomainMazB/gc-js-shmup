class EnemyBase extends GameObject {
    get x () { return this.transform.x }
    get y () { return this.transform.y }
    get width () { return 64 }
    scoreOnKill = 10

    constructor(pGameObjectManager, pTransform) {
        super(pGameObjectManager, pTransform)
        this.addComponent(new RigidBody())
    }
}