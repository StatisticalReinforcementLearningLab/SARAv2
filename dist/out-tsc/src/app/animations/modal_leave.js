//see blog -- https://www.joshmorony.com/create-a-custom-modal-page-transition-animation-in-ionic/
export function myLeaveAnimation(AnimationC, baseEl) {
    var baseAnimation = new AnimationC();
    var backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));
    var wrapperAnimation = new AnimationC();
    var wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    var wrapperElRect = wrapperEl.getBoundingClientRect();
    wrapperAnimation
        .fromTo('transform', 'scaleX(1) scaleY(1)', 'scaleX(0.1) scaleY(0.1)')
        .fromTo('opacity', 1, 0);
    backdropAnimation.fromTo('opacity', 0.4, 0.0);
    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('ease-out')
        .duration(400)
        .add(backdropAnimation)
        .add(wrapperAnimation));
}
//# sourceMappingURL=modal_leave.js.map