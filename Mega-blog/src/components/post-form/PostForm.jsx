import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index'
import appwriteService from "../../appwrite/config"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post }) {
  console.log("PostForm rendered");

    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post ?.title || '',
            slug: post?.slug || '',
            contents: post?.content || '',
            status:post ?.status || ''
        }
    })
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    
  const submit = async (data) => {
    console.log("📤 Form submission started...");
    console.log("🧾 Form data:", data);
    console.log(userData)
    if (!userData || !userData.$id) {
      console.error("User not logged in or userData missing!");
      return;
    }
        if (post) {
            const file=data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            
            if (file) {
                appwriteService.deleteFile(post.featuredImage)
            }
          const bdPost = await appwriteService.updatePost(post.$id, {
            ...data,
            featuredImage: file ? file.$id : undefined,
               
          });
          if (bdPost) {
            navigate(`/post/${bdPost.$id}`);
          }
        }
        else {
            const file = await appwriteService.uploadFile(data.image[0])
            if (file) {
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({
                  ...data,
                  featuredImage: file ? file.$id : undefined,
                  userid: userData?.$id,
                });
                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value &&typeof value==='string') return value
            .trim()
            .toLowerCase()
            .replace(/^[a-zA-Z\d\s ]+/g, '-')
            .replace(/\s/g, '-')
        
        return ''
    }, [])
    
    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug',slugTransform(value.title,{shouldValidate:true}))
            }
        })
        
        return () => {
            subscription.unsubscribe()
        }
    },[watch,slugTransform,setValue])
  return (
    <form onSubmit={handleSubmit(submit, (errors) => {
      console.log("❌ Validation errors",errors);
    })} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="contents"
          control={control}
          defaultValue={getValues("contents")}
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
          
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default PostForm
