const Navbar = () =>{
return(
  <div style={{backgroundColor: "white", color: "black"}}>
    <nav style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
        <div>
          <a href="/">Logo</a>
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
          <button>Home</button>
          <button>Posts</button>
          <button>Favorite</button>
          <button>Profile</button>

        </div>
    </nav>
  </div>
)
}

export default Navbar;