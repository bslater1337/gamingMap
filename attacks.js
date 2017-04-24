exports.AbstractAttack = class AbstractAttack{
  constructor(damage, range, minRange, damageType){
    this.damage = damage;
    this.range = range || 1;
    this.minRange = minRange || 0;
    this.damageType = damageType || "abstract";
  }
  getRange(){
    return this.range;
  }
  effects(attacker, attackee) {
    attackee.takeDamage(this.damage);
  }
}

exports.BowAttack = class BowAttack extends exports.AbstractAttack  {
  effects(attacker, attackee) {
    if (distance(attacker, attackee) <= this.range &&
        distance(attacker, attackee) >= this.minRange)  {
          super.effects(attacker, attackee);
        }
  }
}

//sideEffects
