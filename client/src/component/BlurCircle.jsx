const BlurCircle = ({ top = "auto", right = "auto", left = "auto", bottom = "auto" }) => {
    return (
        <div className="absolute -z-50 h-56 w-56 aspect-square rounded-full bg-primary/30 blur-3xl" style={{ top: top, right: right, left: left, bottom: bottom }}>

        </div>
    )
}

export default BlurCircle

