import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

function LogIn({ auth, setUser, setPageBody }) {
  const [registration, setRegistration] = useState(false);
  const [linkText, setLinkText] = useState('register');

  const toggleRegistration = (e) => {
    e.preventDefault();
    setRegistration(!registration);
    linkText === 'register' ? setLinkText('log in') : setLinkText('register');
  };

  const formSubmission = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (registration) {
      const password2 = e.target.reentered.value;
      
      if (password !== password2) {
        alert('passwords do not match')
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const { user } = userCredential;
          })
          .catch((error) => {
            const { code, message } = error;
            console.log(`code: ${code}\n${message}`);
          });
      }
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { user } = userCredential;
        })
        .catch((error) => {
          const { code, message } = error;
          console.log(`code: ${code}\n${message}`);
        });
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setPageBody('Lifts');
      } else {
        setUser(null);
        setPageBody('LogIn');
      }
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <div className="flex justify-center items-center text-center pt-40 w-3/4 mx-auto">
      <form onSubmit={formSubmission} className="w-96">
        <div className="flex flex-col">
          <input type="email" placeholder="email" name="email" required className="input input-bordered mb-1" />
          <input type="password" placeholder="password" name="password" required className="input input-bordered mb-1" />
          {registration && (<input type="password" placeholder="re-enter password" name="reentered" required className="input input-bordered mb-1" />)}
          <button className="btn btn-outline">submit</button>
          <a href="#" onClick={toggleRegistration} className="no-underline hover:underline ...">{linkText}</a>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
