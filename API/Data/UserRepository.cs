using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        public DataContext _context { get; }
        public IMapper _mapper { get; }

        public UserRepository(DataContext context,IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }
        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(u => u.Username == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(p => p.Photos).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public void update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        {
           return await _context.Users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
           .ToListAsync();
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            // return await _context.Users
            // .Where(x => x.Username == username)
            // .Select(user => new MemberDto
            // {
            //     Id = user.Id,
            //     username = user.Username
            // }).SingleOrDefaultAsync();
                        return await _context.Users
            .Where(x => x.Username == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }
    }
}