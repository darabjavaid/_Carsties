FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# Copy Zscaler PEM certificates
COPY ZscalerRootCA.pem /usr/local/share/ca-certificates/ZscalerRootCA.crt

# Update CA store in Linux container
RUN update-ca-certificates

COPY Carsties.sln ./
COPY src/GatewayService/GatewayService.csproj ./src/GatewayService/

RUN dotnet restore ./src/GatewayService/GatewayService.csproj

COPY . .
RUN dotnet publish ./src/GatewayService/GatewayService.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GatewayService.dll"]