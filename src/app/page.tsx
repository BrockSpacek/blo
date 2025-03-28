"use client"
import { createAccount, getLoggedInUserData, login } from "@/utils/DataServices";
import { Itoken } from "@/utils/Interfaces";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";




export default function Home() {
const [switchBool, setSwitchBool] = useState<boolean>(true);
const [username, setUsername] = useState<string>('')
const [password, setPassword] = useState<string>('');

const router = useRouter();

// This will handle the switch between our login and our create account logic
const handleSwitch = () => {
  setSwitchBool(!switchBool);
}

const handleSubmit = async () => {
    let userData = {
      username: username,
      password: password
    }

    console.log(userData)

    if(switchBool){
      // Create Account Logic Here
      let result = await createAccount(userData);

      result ? alert("Account Created!") : alert("Username Already Exists");

    } else {
      // Login Logic here
      let token: Itoken = await login(userData);

      if(token != null){
        if(typeof window != null){
          localStorage.setItem("Token", token.token);
          console.log(token.token)
          await getLoggedInUserData(username);

          router.push('/Dashboard');
        }
      }else{
        alert("Login was no good! Wrong Password or something like that")
      }
      
    }
}


  return (
    <main className="grid grid-flow-row justify-center mt-[15rem]">
        <div className="bg-slate-400 min-w-96 p-8 rounded-lg">
          <h1 className="text-3xl">{switchBool ? 'Create Account' : 'Login'}</h1>
        <form className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="username">Your Username</Label>
        </div>
        <TextInput id="username" type="text" placeholder="Enter Username" required onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password1">Your password</Label>
        </div>
        <TextInput id="password1" type="password" required onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="flex items-center gap-2">
        <Button color="light" onClick={handleSwitch}>{switchBool ? "Already have an Account" : 'Click to Create Account'}</Button>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
        </div>
    </main>
  );
}
