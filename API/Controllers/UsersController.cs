using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
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

        // }
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
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
return Ok(users);
            return Ok(usersToReturn);
        }
        //api/users/3

        // [HttpGet("{id}")]
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {

            // var user = await _userRepository.Users.FirstOrDefaultAsync(u => u.Id == id);
            //  return user;
            //var user = await _userRepository.GetUserByUsernameAsync(username);
             //return _mapper.Map<MemberDto>(user);
            return await _userRepository.GetMemberAsync(username);
         //   return _mapper.Map<MemberDto>(user);
            
           

        }
    }
}