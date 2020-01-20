let express = require('express');
let router = express.Router();
let models = require('../models');
let moment = require('moment');

//글 목록 페이지
router.get('/', function(req, res, next) {
  models.post.findAll()
  .then(result=>{
    //날짜 포맷 변경
    let post = function(){
      let posts=[];
      for(let i =0; i<result.length;i++){
        let post_data= moment(result[i].createdAt).format("YYYY-MM-DD HH:mm:ss")
        //console.log(post_data);
        posts.push({
          post_data:result[i],
          date:post_data
        });
      }
      return posts;
    }
    res.render("index",{
      posts:post()
    });
    //  console.log(post().post_data.id);
  });
});

//글 수정페이지 이동
router.get('/update/:id',function(req,res,next){
  let post_id =req.params.id;
  models.post.findOne({
    where: {id:post_id}
  })
  .then(result =>{
    //console.log(result.description);
    res.render("edit",{
      post:result
    });
  })
  .catch(err=>{
    console.log("데이터 조회 실패");
  });
});

//글 수정
router.put('/update/:id', function(req, res, next) {
  let post_id = req.params.id;
  let body = req.body;
  models.post.findOne({
    where:{id:post_id}
  })
  .then(result=>{
    let post_pwd = result.pwd;
    let input_pwd = body.edit_pwd;
    //수정시 글 비밀번호 비교
    if(post_pwd === input_pwd){
      models.post.update({
        title: body.edit_title,
        writer: body.edit_writer,
        description:body.edit_description
      },{
        where:{id:post_id}
      })
      .then(result2 =>{
        console.log("수정완료");
        res.redirect("/");  
      })
    }
  })
  .catch(err=>{
    console.log(err,"수정 실패");
  })
});

//글 삭제
router.delete('/delete/:id',function(req,res,next){
  let post_id=req.params.id;
  let post_delete=req.body.post_delete;
  models.post.findOne({
    where:{id:post_id}
  })
  .then(result =>{
    let post_pwd = result.pwd;
    //삭제시 글 비밀번호 비교 
    if(post_pwd === post_delete){
      models.post.destroy({
        where:{id:post_id}
      })
      .then(result2 =>{
        res.redirect("/")
      })
    }
  })
  .catch(err=>{
    console.log(err);
  })
});

//글 상세페이지
router.get('/post/:id', function(req, res, next){
  let post_id = req.params.id;
  models.post.findAll({
    where:{id:post_id}
  })
  .then(result=>{
    //날짜 포맷 변경
    let post = function(){
      let posts=[];
      for(let i =0; i<result.length;i++){
        let post_data= moment(result[i].createdAt).format("YYYY-MM-DD HH:mm:ss")
        //console.log(post_data);
        posts.push({
          post_data:result[i],
          date:post_data
        });
      }
      return posts;
    }
    res.render("post",{
      posts:post()
    })
  })
  .catch(err=>{
    console.log(err);
  })
});

//글 생성 페이지 이동
router.get('/create_post',function(req,res,next){
  res.render('create_post');
});

// 글 생성
router.post('/create_post', function(req,res,next){
  let body=req.body;

  models.post.create({
    title: body.title,
    writer: body.username,
    description:body.description,
    pwd:body.pwd
  })
  .then(result =>{
    console.log("글쓰기 완료");
    res.redirect("/");
  })
  .catch(err=>{
    console.log("데이터 추가 실패");
  })
});

module.exports = router;
