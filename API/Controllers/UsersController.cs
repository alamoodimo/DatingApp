using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;

        // public UsersController(DataContext context)
        // {
        //     _context = context;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        // }
        public UsersController(IUserRepository userRepository
        , IMapper mapper
        , IPhotoService photoService)
        {
            _photoService = photoService;
            _mapper = mapper;
            _userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {

            //var user = await _userRepository.GetUsersAsync();
            // return Ok(await _userRepository.GetUsersAsync());
            var users = await _userRepository.GetUsersAsync();
            //                  To Object,From Object(source)
            var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            var usersM = await _userRepository.GetMembersAsync();
            // return Ok(users);
            return Ok(usersToReturn);
        }
        //api/users/3

        // [HttpGet("{id}")]
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {

            // var user = await _userRepository.Users.FirstOrDefaultAsync(u => u.Id == id);
            //  return user;
            //var user = await _userRepository.GetUserByUsernameAsync(username);
            //return _mapper.Map<MemberDto>(user);
            return await _userRepository.GetMemberAsync(username);
            //   return _mapper.Map<MemberDto>(user);



        }

        [HttpPut]

        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {

            // var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // var username = User.GetUsername();
            //var user = await _userRepository.GetUserByUsernameAsync(username);
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(memberUpdateDto, user);

            _userRepository.update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }


        [HttpPost("add-photo")]


        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);


            if (await _userRepository.SaveAllAsync())
            {

                //  return _mapper.Map<PhotoDto>(photo);
                //return CreatedAtRoute("GetUser",_mapper.Map<PhotoDto>(photo));
                return CreatedAtRoute("GetUser", new { Username = user.Username }, _mapper.Map<PhotoDto>(photo));

            }


            return BadRequest("Problem adding photo");




        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("this is already your main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");



        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {

            var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id==photoId);

            if(photo == null) return NotFound();


            if(photo.IsMain) return  BadRequest("You cannot delete your main photo");

            if(photo.PublicId!= null)
            {

               var result= await _photoService.DeletingPhotoAsync(photo.PublicId);
               if(result.Error!=null) return BadRequest(result.Error.Message);


            }


            user.Photos.Remove(photo);
            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo");
        }

    }
}