function LogIn() {
  
  return (
    <div className="flex justify-center items-center mt-40">
      <form className="w-96">
        <div className="flex flex-col">
          <input type="email" placeholder="email" name="email" required className="input input-bordered mb-1" />
          <input type="password" placeholder="password" name="password" required className="input input-bordered mb-1" />
          <button className="btn">submit</button>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
