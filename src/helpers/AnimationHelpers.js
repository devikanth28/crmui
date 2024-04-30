const AnimationHelpers = () => {

    const getBadgeAnimation = (classes, showAnimation, setShowAnimation) => {

        if(showAnimation){
            setTimeout(() => {
                setShowAnimation(false);
            }, [800]);
            return classes.concat(" ","shakeY");
        }
        else{
            return classes;
        }
    };

    return Object.freeze({
        getBadgeAnimation
    });

};

export default AnimationHelpers;