using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using System.Text;
using WiMSAPI.Helper;
using OfficeOpenXml;

namespace WiMSAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Database setup
            DatabaseFactory.SetDatabases(() => new SqlDatabase(Configuration.GetConnectionString("DefaultConnection")), getDatabase);

            // JWT Authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
              .AddJwtBearer(options =>
              {
                  options.TokenValidationParameters = new TokenValidationParameters
                  {
                      ValidateIssuer = true,
                      ValidateAudience = true,
                      ValidateLifetime = true,
                      ValidateIssuerSigningKey = true,
                      ValidIssuer = Configuration["Jwt:Issuer"],
                      ValidAudience = Configuration["Jwt:Audience"],
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                  };
              });

            // Authorization Policy
            services.AddAuthorization(options =>
                options.AddPolicy("ValidAccessToken", policy =>
                {
                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
                    policy.RequireAuthenticatedUser();
                }));

            // CORS Policy
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                .Build());
            });

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<IExcelProcessor,  ExcelProcessor>();
            // IIS Configuration
            services.Configure<IISOptions>(options =>
            {
                options.ForwardClientCertificate = false;
                options.AutomaticAuthentication = false;
            });

            // Swagger Configuration
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "WiMS API",
                    Version = "v1",
                    Description = "API documentation for WiMS system"
                });

                // Adding JWT Authentication to Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid JWT token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        new string[] {}
                    }
                });
            });

            // Add Controllers
            services.AddControllers(
                options =>
                {
                    options.Filters.Add<ValidationFilter>();
                }
            ).AddJsonOptions(a => { a.JsonSerializerOptions.Converters.Add(new JsonDateTimeConverter()); });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("CorsPolicy");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

         
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "WiMS API v1");
                c.RoutePrefix = "swagger"; 
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        private Database getDatabase(string name)
        {
            return new SqlDatabase(Configuration.GetConnectionString("DefaultConnection"));
        }
    }
}





//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Builder;
//using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Hosting;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.Practices.EnterpriseLibrary.Data;
//using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
//using System.Text;
//using WiMSAPI.Helper;

//namespace WiMSAPI
//{
//    public class Startup
//    {
//        public Startup(IConfiguration configuration)
//        {
//            Configuration = configuration;
//        }

//        public IConfiguration Configuration { get; }

//        // This method gets called by the runtime. Use this method to add services to the container.
//        public void ConfigureServices(IServiceCollection services)
//        {
//            DatabaseFactory.SetDatabases(() => new SqlDatabase(Configuration.GetConnectionString("DefaultConnection")), getDatabase);
//            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//              .AddJwtBearer(options =>
//              {
//                  options.TokenValidationParameters = new TokenValidationParameters
//                  {
//                      ValidateIssuer = true,
//                      ValidateAudience = true,
//                      ValidateLifetime = true,
//                      ValidateIssuerSigningKey = true,
//                      ValidIssuer = Configuration["Jwt:Issuer"],
//                      ValidAudience = Configuration["Jwt:Audience"],
//                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
//                  };
//              });

//            services.AddAuthorization(options =>
//                options.AddPolicy("ValidAccessToken", policy =>
//                {
//                    policy.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
//                    policy.RequireAuthenticatedUser();
//                }));

//            services.AddCors(options =>
//            {
//                options.AddPolicy("CorsPolicy",
//                    builder => builder.AllowAnyOrigin()
//                      .AllowAnyMethod()
//                      .AllowAnyHeader()
//                .Build());
//            });
//            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

//            services.Configure<IISOptions>(options =>
//            {
//                options.ForwardClientCertificate = false;
//                options.AutomaticAuthentication = false;
//            });
//            services.AddSwaggerGen();
//            services.AddControllers(
//                options =>
//                {
//                    options.Filters.Add<ValidationFilter>();
//                }
//            ).AddJsonOptions(a => { a.JsonSerializerOptions.Converters.Add(new JsonDateTimeConverter()); });
//        }

//        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
//        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
//        {
//            app.UseCors("CorsPolicy");
//            if (env.IsDevelopment())
//            {
//                app.UseSwagger();
//                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WiMS API v1"));
//                app.UseDeveloperExceptionPage();
//            }
//            else
//            {
//                app.UseExceptionHandler("/error");
//            }

//            app.UseHttpsRedirection();

//            app.UseRouting();
//            app.UseAuthentication();
//            app.UseAuthorization();



//            app.UseEndpoints(endpoints =>
//            {
//                endpoints.MapControllers();
//            });
//        }


//        private Database getDatabase(string name)
//        {
//            return new SqlDatabase(Configuration.GetConnectionString("DefaultConnection"));
//        }
//    }


//}