package com.bdsa.disertatie.backend;

import io.undertow.client.ClientCallback;
import io.undertow.client.ClientConnection;
import io.undertow.client.UndertowClient;
import io.undertow.server.HttpServerExchange;
import io.undertow.server.ServerConnection;
import io.undertow.server.handlers.proxy.ProxyCallback;
import io.undertow.server.handlers.proxy.ProxyClient;
import io.undertow.server.handlers.proxy.ProxyConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xnio.IoUtils;
import org.xnio.OptionMap;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class ReverseProxyClient implements ProxyClient {
    Logger LOG = LoggerFactory.getLogger(ReverseProxyClient.class);

    interface MyProxyTarget extends ProxyTarget {
        URI getTargetUri();
    }

    private final UndertowClient client = UndertowClient.getInstance();

    private Map<String, String> rules = new HashMap<>();

    private Pattern pattern = Pattern.compile("^/(\\w+)(/.*)");

    private Map<String, URI> targets;

    @PostConstruct
    private void init() {
        targets = rules.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> URI.create(e.getValue())));
        LOG.info("init, targets={}", targets);
    }

    @Override
    public ProxyTarget findTarget(HttpServerExchange exchange){
        LOG.info("findTarget, exchange.getRequestURI={}", exchange.getRequestURI());

        Matcher matcher = pattern.matcher(exchange.getRequestURI());
        if(matcher.find()){
            String targetUriSegment = matcher.group(1);
            String remainingUri = matcher.group(2);

            if(targets.containsKey(targetUriSegment)) {
                LOG.info("findTarget, found targetUriSegment={}, remaininguri={}", targetUriSegment, remainingUri);
                // If the first uri segment is in the mapping, update targetUri
                // Strip the request uri from the part that is used to map upon.
                exchange.setRequestURI(remainingUri);
                return (MyProxyTarget) () -> targets.get(targetUriSegment);
            }
        }
        return null;
    }

    @Override
    public void getConnection(ProxyTarget target, HttpServerExchange exchange, ProxyCallback<ProxyConnection> callback,
                              long timeout, TimeUnit timeUnit) {
        LOG.info("exchange.getRequestURI={}, proxyTarget={}", exchange.getRequestURI(), target);

        client.connect(new ConnectNotifier(callback, exchange), ((MyProxyTarget)target).getTargetUri(),
                exchange.getIoThread(), exchange.getConnection().getByteBufferPool(), OptionMap.EMPTY);
    }

    public Map<String,String> getRules() {return rules;}

    public  void setRules(Map<String,String> rules) {this.rules = rules;}

    private final class ConnectNotifier implements ClientCallback<ClientConnection>{
        private final ProxyCallback<ProxyConnection> callback;
        private final HttpServerExchange exchange;

        public ConnectNotifier(ProxyCallback<ProxyConnection> callback, HttpServerExchange exchange) {
            this.callback = callback;
            this.exchange = exchange;
        }

        @Override
        public void completed(ClientConnection clientConnection) {
            final ServerConnection serverConnection = exchange.getConnection();
            serverConnection.addCloseListener(serverConnection1 -> IoUtils.safeClose(clientConnection));
            callback.completed(exchange, new ProxyConnection(clientConnection, "/"));
        }

        @Override
        public void failed(IOException e) {
            callback.failed(exchange);
        }
    }
}
