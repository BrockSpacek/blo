"use client";
import {
  Button,
  Dropdown,
  DropdownItem,
  FileInput,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  ListGroup,
} from "flowbite-react";
import { addBlogItem, checkToken, DeleteBlogItem, getBlogItemsByUserId, getToken, loggedInData, updateBlogItem } from "@/utils/DataServices";
import React, { useEffect, useState } from "react";
import { IBlogItems } from "@/utils/Interfaces";
import BlogEntires from "@/utils/BlogEntries.json";
import { useRouter } from "next/navigation";
import { format } from "date-fns";


const page = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  // These useStates will be for our Form
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogImage, setBlogImage] = useState<any>();
  const [blogDescription, setBlogDescription] = useState<string>("");
  const [blogCategories, setBlogCategories] = useState<string>("");
  const [blogId, setBlogId] = useState<number>(0);
  const [blogUserId, setBlogUserId] = useState<number>(0);
  const [blogPublisherName, setBlogPublisherName] = useState<string>("");

  const [edit, setEdit] = useState<boolean>(false);

  const [blogItems, setBlogItems] = useState<IBlogItems[]>(BlogEntires);

  const router = useRouter();

  useEffect(()=> {
    const getLoggedInData = async () => {
      // Get the User's Info
      const loggedIn = loggedInData();
      console.log(loggedIn)
      console.log(getToken())
      setBlogUserId(loggedIn.id);
      setBlogPublisherName(loggedIn.username);

      // Get the user's blog items
      const userBlogItems = await getBlogItemsByUserId(loggedIn.id, getToken());

      console.log(userBlogItems);

       // Set the user's blog items inside of our useState
      setBlogItems(userBlogItems);
    }

    if(!checkToken()){
      // Push to Login Page

      router.push('/');
    }else{
      // Get User Data / Login Logic
      getLoggedInData();
    }
  }, [])

  // -----------------Form Functions---------------------

  const handleTitle = (e:React.ChangeEvent<HTMLInputElement>) => setBlogTitle(e.target.value);

  const handleDescription = (e:React.ChangeEvent<HTMLInputElement>) => setBlogDescription(e.target.value);

  const handleCategories = (categories: string) => setBlogCategories(categories)


  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We're creating a new file reader object
    let reader = new FileReader();

    // Then we are going to get the first file we uploaded
    let file = e.target.files?.[0]

    // And if there is a file to select
    if(file){
      //When this file is turned into a string this onLoad function will run
      reader.onload = () => {
        setBlogImage(reader.result); // Once the file is read we will store the result into our setter function
      }

      reader.readAsDataURL(file); // This converts our file to a base64 encoded string
    }
  

  } 

  // -----------------According Functions------------------

  const handleShow = () => {
    setOpenModal(true);
    setEdit(false);
    setBlogId(0);
    setBlogUserId(blogUserId);
    setBlogPublisherName(blogPublisherName);
    setBlogTitle("");
    setBlogImage("");
    setBlogDescription("");
    setBlogCategories("");
  }
  
  const handleEdit = (items: IBlogItems) => {
    setOpenModal(true);
    setEdit(true);
    setBlogId(items.id);
    setBlogUserId(items.userId);
    setBlogPublisherName(items.publisherName);
    setBlogTitle(items.title);
    setBlogImage(items.image);
    setBlogDescription(items.description);
    setBlogCategories(items.category);
  }

  const handlePublish = async (items:IBlogItems) => {
    items.isPublished = !items.isPublished;

    let result = await updateBlogItem(items, getToken());

    if(result){
      let userBlogItems = await getBlogItemsByUserId(blogUserId, getToken());
      setBlogItems(userBlogItems);
    }else{
      alert("Blog was not published");
    }
  }

  const handleDelete = async (items:IBlogItems) => {
    items.isDeleted = true;

    let result = await DeleteBlogItem(items, getToken());

    if(result){
      let userBlogItems = await getBlogItemsByUserId(blogUserId, getToken());
      setBlogItems(userBlogItems)
    }else{
      alert("Blog Item(s) were not deleted")
    }
  }

  // ----------------Save Function-------------------------

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {

    const item: IBlogItems = {
      id: blogId,
      userId: blogUserId,
      publisherName: blogPublisherName,
      title: blogTitle, 
      image: blogImage,
      description: blogDescription,
      date: format(new Date(), 'MM-dd-yyyy'),
      category: blogCategories,
      isPublished: e.currentTarget.textContent === 'Save' ? false : true,
      isDeleted: false
    }
    setOpenModal(false);

    let result = false;

    if(edit){
      // Our Edit Login Will go here
      result = await updateBlogItem(item, getToken())
    }else{
      // Our Add Logic will go here
      result = await addBlogItem(item, getToken());
    }

    if(result){
      let userBlogItems = await getBlogItemsByUserId(blogUserId, getToken());
      setBlogItems(userBlogItems); 
    }else{
      alert(`Blog Items were not ${edit ? 'Updated' : 'Added'}`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col p-24">
    <div className="flex flex-col items-center mb-10">
      <h1 className="text-center text-3xl"> Dashboard Page </h1>
      <Button onClick={handleShow}>Add Blog</Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>{edit ? 'Edit Blog Post' : 'Add Blog Post'}</ModalHeader>
        <ModalBody>
          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                {/* Title, Image, Description Category, Tags */}
                <Label htmlFor="Title">Title</Label>
              </div>
              <TextInput id="Title" type="text" placeholder="Title" required onChange={handleTitle}/>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="descrption">Description</Label>
              </div>
              <TextInput
                id="Description"
                placeholder="Description"
                type="text"
                required
                onChange={handleDescription}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Dropdown label="Categories" dismissOnClick={true}>
                  <DropdownItem onClick={() => handleCategories("Jiu Jitsu")}>Jiu Jitsu</DropdownItem>
                  <DropdownItem onClick={() => handleCategories("Boxing")}>Boxing</DropdownItem>
                  <DropdownItem onClick={() => handleCategories("Kung Fu")}>Kung Fu</DropdownItem>
                </Dropdown>
              </div>
              <div className="mb-2 block">
                <Label htmlFor="Image">Image</Label>
              </div>
              <FileInput
                onChange={handleImage}
                id="Picture"
                accept="image/png, image/jpg"
                placeholder="Chose Picture"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave}>Save and publish</Button>
          <Button onClick={handleSave}>Save</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Accordion alwaysOpen className="w-3xl mt-5">
        <AccordionPanel>
          <AccordionTitle>Published Blog Items</AccordionTitle>
          <AccordionContent>
            <ListGroup>
              {
                blogItems && blogItems.map((item: IBlogItems, idx: number) => {
                  return(
                    <div key={idx}>
                      {
                        item.isPublished && !item.isDeleted && (
                          <div className="flex flex-col p-10">
                            <h2 className="text-3xl">{item.title}</h2>
                            <div className="flex flex-row space-x-3">
                              <Button color="blue" onClick={() => handleEdit(item)}>Edit</Button>
                              <Button color="red" onClick={() => handleDelete(item)}>Delete</Button>
                              <Button color="yellow" onClick={() => handlePublish(item)}>Unpublish</Button>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  )
                })
              }
            </ListGroup>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel>
          <AccordionTitle>Unpublished Blog Items</AccordionTitle>
          <AccordionContent>
            <ListGroup>
            {
                blogItems && blogItems.map((item: IBlogItems, idx: number) => {
                  return(
                    <div key={idx}>
                      {
                        !item.isPublished && !item.isDeleted && (
                          <div className="flex flex-col p-10">
                            <h2 className="text-3xl">{item.title}</h2>
                            <div className="flex flex-row space-x-3">
                              <Button color="blue" onClick={() => handleEdit(item)}>Edit</Button>
                              <Button color="red" onClick={() => handleDelete(item)}>Delete</Button>
                              <Button color="yellow" onClick={() => handlePublish(item)}>Unpublish</Button>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  )
                })
              }
            </ListGroup>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
    </main>
  );
};

export default page;
